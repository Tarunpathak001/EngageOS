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

    console.log("Sending OTP to:", email);
    console.log("OTP:", otp);

    await transporter.verify();
    console.log("SMTP VERIFIED");

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

    console.log("EMAIL SENT");
    console.log(info.messageId);

  } catch (error) {

    console.log("EMAIL ERROR");
    console.log(error);

    throw error;
  }
};

module.exports = {
  sendOTPEmail,
};