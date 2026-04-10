require("dotenv").config();
const amqp = require("amqplib");
const nodemailer = require("nodemailer");
const pool = require("./config/db");

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
          SELECT a.id, u.name AS applicant_name, u.email AS applicant_email, 
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
              text: `Halo, ada kandidat yang melamar lowongan Anda!\n\nNama Pelamar: ${info.applicant_name}\nEmail Pelamar: ${info.applicant_email}\nTanggal Lamaran: ${new Date().toLocaleString()}`,
              html: `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
                  
                  <div style="background-color: #2563EB; padding: 25px 20px; text-align: center; color: white;">
                    <h2 style="margin: 0; font-size: 24px;">🔔 Lamaran Baru Masuk!</h2>
                    <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Posisi: ${info.job_title}</p>
                  </div>
                  
                  <div style="padding: 30px 20px; background-color: #ffffff;">
                    <p style="font-size: 16px; color: #333333; line-height: 1.5;">Halo,</p>
                    <p style="font-size: 16px; color: #333333; line-height: 1.5;">Kabar baik! Ada kandidat hebat yang baru saja melamar ke perusahaan Anda. Berikut adalah rincian profilnya:</p>
                    
                    <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; border-left: 5px solid #2563EB; margin: 25px 0;">
                      <p style="margin: 0 0 10px 0; font-size: 15px; color: #4B5563;">
                        <strong style="color: #111827;">🧑‍💼 Nama Pelamar:</strong><br> ${info.applicant_name}
                      </p>
                      <p style="margin: 0 0 10px 0; font-size: 15px; color: #4B5563;">
                        <strong style="color: #111827;">📧 Email Pelamar:</strong><br> 
                        <a href="mailto:${info.applicant_email}" style="color: #2563EB; text-decoration: none;">${info.applicant_email}</a>
                      </p>
                      <p style="margin: 0; font-size: 15px; color: #4B5563;">
                        <strong style="color: #111827;">📅 Waktu Lamaran:</strong><br> ${new Date().toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div style="background-color: #F9FAFB; padding: 15px 20px; text-align: center; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0; font-size: 12px; color: #6B7280;">
                      Email ini dibuat otomatis oleh sistem <strong>OpenJob RESTful API V2</strong>.<br>
                      Mohon untuk tidak membalas langsung ke alamat email ini.
                    </p>
                  </div>
                  
                </div>
              `,
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
