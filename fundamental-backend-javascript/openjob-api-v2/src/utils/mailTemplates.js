const applicationEmailTemplate = (info) => {
  return `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
      <div style="background-color: #2563EB; padding: 25px 20px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 24px;">🔔 Lamaran Baru Masuk!</h2>
        <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Posisi: ${info.job_title}</p>
      </div>
      <div style="padding: 30px 20px; background-color: #ffffff;">
        <p style="font-size: 16px; color: #333333; line-height: 1.5;">Ada kandidat hebat yang melamar. Berikut profilnya:</p>
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; border-left: 5px solid #2563EB; margin: 25px 0;">
          <p><strong>Nama Pelamar:</strong><br> ${info.applicant_name}</p>
          <p><strong>Email Pelamar:</strong><br> <a href="mailto:${info.applicant_email}">${info.applicant_email}</a></p>
          <p><strong>Waktu Lamaran:</strong><br> ${new Date(info.created_at).toLocaleString()}</p>
        </div>
      </div>
    </div>
  `;
};

module.exports = { applicationEmailTemplate };
