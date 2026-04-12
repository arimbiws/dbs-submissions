require("dotenv").config();
const amqp = require("amqplib");
const nodemailer = require("nodemailer");
const pool = require("./config/db");
const { applicationEmailTemplate } = require("./utils/mailTemplates");

const init = async () => {
  try {
    const host = process.env.RABBITMQ_HOST || "localhost";
    const port = process.env.RABBITMQ_PORT || 5672;
    const user = process.env.RABBITMQ_USER || "guest";
    const pass = process.env.RABBITMQ_PASSWORD || "guest";
    const url = `amqp://${user}:${pass}@${host}:${port}`;

    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();
    const queue = "application:process";

    await channel.assertQueue(queue, { durable: true });

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: process.env.MAIL_PORT == 465,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    console.log("Consumer berjalan dan menunggu pesan di RabbitMQ...");

    channel.prefetch(1);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());
          const applicationId = data.application_id;

          console.log(`\n⏳ Menerima pesan lamaran dengan ID: ${applicationId}`);

          const query = `
            SELECT a.id, a.created_at, u.name AS applicant_name, u.email AS applicant_email, 
                  j.title AS job_title, recruiter.email AS recruiter_email
            FROM applications a
            JOIN users u ON a.user_id = u.id
            JOIN jobs j ON a.job_id = j.id
            JOIN users recruiter ON j.recruiter_id = recruiter.id  
            WHERE a.id = $1
          `;

          const result = await pool.query(query, [applicationId]);

          if (result.rows.length > 0) {
            const info = result.rows[0];
            const mailOptions = {
              from: '"OpenJob V2 - Coding Camp 2026" <no-reply@openjob.com>',
              to: info.recruiter_email,
              subject: `Lamaran Baru: ${info.job_title}`,
              text: `Halo, ada kandidat yang melamar lowongan Anda!\n\nNama Pelamar: ${info.applicant_name}\nEmail Pelamar: ${info.applicant_email}\nTanggal Lamaran: ${new Date(info.created_at).toLocaleString("id-ID")}`,
              html: applicationEmailTemplate(info),
            };

            await new Promise((resolve) => setTimeout(resolve, 3000));
            await transporter.sendMail(mailOptions);
            console.log(`📤 Email berhasil terkirim ke recruiter: ${info.recruiter_email}`);
          } else {
            console.log(`❌ DIBATALKAN: Lamaran ${applicationId} tidak ditemukan di database.`);
          }
          channel.ack(msg);
        } catch (error) {
          console.error("❌ Gagal memproses/mengirim email:", error.message);
          channel.ack(msg);
        }
      }
    });
  } catch (error) {
    console.error("Gagal menjalankan consumer:", error);
  }
};

init();
