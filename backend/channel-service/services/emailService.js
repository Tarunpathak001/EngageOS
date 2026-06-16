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

    console.log("SMTP ERROR:");
    console.log(error);

  } else {

    console.log(
      "SMTP SERVER READY"
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
    <div>

      <p>
        ${message}
      </p>

<br/>

<a
href="${process.env.BACKEND_URL}/tracking/click/${logId}"
>
style="
background:#9333ea;
padding:12px 20px;
color:white;
text-decoration:none;
border-radius:8px;
"
>
View Offer
</a>

<img
src="${process.env.BACKEND_URL}/tracking/open/${logId}"
width="1"
height="1"
/>

    </div>
  `

});

    console.log(
      `📧 Email Sent To ${to}`
    );

};

module.exports = {
  sendEmail,
};   