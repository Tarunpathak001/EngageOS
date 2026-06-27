const nodemailer =
  require("nodemailer");

const transporter =
  nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 587,

    secure: false,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },

    tls: {
      rejectUnauthorized: false,
    },

  });

transporter.verify(function (error, success) {

  if (error) {

    console.error("[EMAIL] SMTP connection error:", error);

  } else {

    console.log(
      "[EMAIL] SMTP SERVER READY"
    );

  }

});
const sendEmail =
  async (
    to,
    subject,
    message,
    logId,
  ) => {

    await transporter.sendMail({

      from:
        process.env.EMAIL_USER,

      to,

      subject,

      html: `
<div style="font-family:Arial,sans-serif">

<h2>${subject}</h2>

<p>${message}</p>

<br/>

<a
href="${process.env.BACKEND_URL}/tracking/click/${logId}"
style="
background:#9333ea;
padding:12px 20px;
color:white;
text-decoration:none;
border-radius:8px;
display:inline-block;
"
>
View Offer
</a>

<img
src="${process.env.BACKEND_URL}/tracking/open/${logId}"
width="1"
height="1"
alt=""
/>

</div>
`

    });

    console.log(
      `[EMAIL] Email Sent To: ${to}`
    );

  };

module.exports = {
  sendEmail,
};   