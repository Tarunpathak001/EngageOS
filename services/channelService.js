const prisma =
  require("../prisma/prismaClient");

const nodemailer =
  require("nodemailer");

const transporter =
  nodemailer.createTransport({

    service: "gmail",

    auth: {

      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,

    },

  });

const sendMessage =
  async (
    customerId,
    campaignId
  ) => {

    try {

      const customer =
        await prisma.customer.findUnique({

          where: {
            id: customerId,
          },

        });

      const campaign =
        await prisma.campaign.findUnique({

          where: {
            id: campaignId,
          },

          include: {
            user: true,
          },

        });

      if (
        !customer ||
        !campaign
      ) {

        return {

          success: false,

          reason:
            "Customer or Campaign Not Found",

        };

      }

      await transporter.sendMail({

        from:
          process.env.EMAIL_USER,

        to:
          customer.email,

        subject:
          campaign.name,

        html: `

        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
          "
        >

          <h2
            style="
              color: #6d28d9;
            "
          >
            ${campaign.name}
          </h2>

          <p>
            Hello
            <b>
              ${customer.name}
            </b>,
          </p>

          <p>
            ${campaign.message}
          </p>

          <br/>

          <p>
            Regards,
          </p>

          <b>
            ${
              campaign.user?.name ||
              "EngageOS Team"
            }
          </b>

        </div>

        `,

      });

      console.log(
        `Email Sent To: ${customer.email}`
      );

      return {

        success: true,

        deliveredAt:
          new Date(),

      };

    } catch (error) {

      console.error(
        "Email Error:",
        error.message
      );

      return {

        success: false,

        reason:
          error.message,

      };

    }

};

module.exports = {
  sendMessage,
};