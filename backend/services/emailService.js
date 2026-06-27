const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp) => {
  try {

    console.log(`[EMAIL] Sending OTP to: ${email}`);
    if (process.env.NODE_ENV !== "production") {
      console.log(`[EMAIL] OTP (dev-only): ${otp}`);
    }

    await transporter.verify();
    console.log("[EMAIL] SMTP connection verified");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "EngageOS Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>EngageOS Email Verification</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
        </div>
      `,
    });

    console.log(`[EMAIL] OTP email sent successfully to ${email}`);

  } catch (error) {

    console.error(`[EMAIL] Failed to send OTP email to ${email}:`, error);

    throw error;
  }
};

const sendTelegramInviteEmail = async (email, customerName, inviteLink) => {
  try {
    await transporter.verify();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Connect your Telegram Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
          <h2 style="color: #1a202c; font-size: 20px; font-weight: bold; margin-bottom: 16px; border-bottom: 2px solid #edf2f7; padding-bottom: 12px;">EngageOS Account Onboarding</h2>
          <p style="font-size: 16px; color: #4a5568;">Hello <strong>${customerName}</strong>,</p>
          <p style="font-size: 16px; color: #4a5568; line-height: 1.5; margin-bottom: 24px;">
            To receive Telegram campaign notifications and alerts from EngageOS CRM, please click the secure button below to connect your Telegram account.
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${inviteLink}" style="background-color: #3182ce; color: #ffffff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">Connect Telegram Profile</a>
          </div>
          <p style="font-size: 14px; color: #718096; line-height: 1.5; margin-bottom: 20px;">
            If the button doesn't work, copy and paste this URL directly into your browser:<br/>
            <a href="${inviteLink}" style="color: #3182ce; word-break: break-all;">${inviteLink}</a>
          </p>
          <p style="font-size: 13px; color: #e53e3e; font-weight: 600; background-color: #fff5f5; border: 1px dashed #feb2b2; padding: 10px; border-radius: 6px; display: inline-block;">
            ⚠️ This secure connection invitation expires in 24 hours and is valid for one-time use only.
          </p>
          <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 28px 0;"/>
          <p style="font-size: 12px; color: #a0aec0; line-height: 1.4;">
            This is a system-generated message. If you did not request this integration, please contact your EngageOS CRM administrator or ignore this email.
          </p>
        </div>
      `,
    });

  } catch (error) {
    console.error(`[TELEGRAM] Failed to send Telegram invite email to ${email}:`, error.message);
    throw error;
  }
};

module.exports = {
  sendOTPEmail,
  sendTelegramInviteEmail,
};