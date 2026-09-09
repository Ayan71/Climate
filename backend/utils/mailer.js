const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return null;
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'Climate Energy Portal'}" <${
      process.env.EMAIL_USER || 'noreply@vasudhaindia.org'
    }>`,
    to,
    subject,
    text,
    html,
  };

  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[Mailer] Sent email to ${to} (MessageId: ${info.messageId})`);
      return true;
    } catch (err) {
      console.error(`[Mailer Error] Failed to send email to ${to}: ${err.message}`);
      return false;
    }
  } else {
    // Simulated Mailer for Dev Environment
    console.log(`\n============== [SIMULATED EMAIL NOTIFICATION] ==============`);
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`BODY:\n${text || html}`);
    console.log(`===========================================================\n`);
    return true;
  }
};

const sendAdminWelcomeEmail = async (adminEmail, adminName, password) => {
  const subject = 'Welcome to Climate, Energy & Power Portal - Admin Account Details';
  const text = `Hello ${adminName},\n\nYour Admin account has been created successfully.\n\nLogin Credentials:\nEmail: ${adminEmail}\nPassword: ${password}\n\nPlease log in and update your password.\n\nBest regards,\nVasudha India Portal Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
      <h2 style="color: #0d9488;">Welcome to Climate, Energy & Power Data Portal</h2>
      <p>Hello <strong>${adminName}</strong>,</p>
      <p>An Admin account has been created for you by the Super Admin.</p>
      <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Email:</strong> ${adminEmail}</p>
        <p style="margin: 5px 0;"><strong>Password:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${password}</code></p>
      </div>
      <p>Please change your password after logging in for security reasons.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;"/>
      <p style="font-size: 12px; color: #64748b;">Vasudha India Climate Portal Admin System</p>
    </div>
  `;
  return await sendEmail({ to: adminEmail, subject, text, html });
};

const sendResetPasswordEmail = async (email, resetUrl) => {
  const subject = 'Password Reset Request - Climate Energy & Power Data Portal';
  const text = `You requested a password reset. Please click on the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 1 hour. If you did not request this, please ignore this email.`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
      <h2 style="color: #0d9488;">Password Reset Request</h2>
      <p>You requested a password reset for your account.</p>
      <p>Click the button below to reset your password:</p>
      <div style="margin: 25px 0;">
        <a href="${resetUrl}" style="background-color: #0d9488; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
      </div>
      <p style="font-size: 13px; color: #64748b;">Or copy and paste this link into your browser:<br/>${resetUrl}</p>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 30px;">This link will expire in 1 hour.</p>
    </div>
  `;
  return await sendEmail({ to: email, subject, text, html });
};

module.exports = {
  sendEmail,
  sendAdminWelcomeEmail,
  sendResetPasswordEmail,
};
