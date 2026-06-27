require("dotenv").config();
console.log(
  "[WORKER] Worker File Loaded"
);
const axios =
  require("axios");

const prisma =
  require("../prisma/prismaClient");

const { Worker } =
  require("bullmq");

const worker =
  new Worker(

    "campaignQueue",

    async (job) => {

      console.log(
        `[WORKER] Processing Job: ${job.id}`
      );

      const campaign =
        await prisma.campaign.findUnique({
          where: {
            id:
              job.data.campaignId,
          },
        });

      const customer =
        await prisma.customer.findUnique({

          where: {
            id:
              job.data.customerId,
          },

        });

      if (campaign.channel === "TELEGRAM") {
        if (!customer.telegramConnected || !customer.telegramChatId) {
          console.log(`[TELEGRAM] Skipping customer ${customer.email} (not connected or missing chat ID)`);
          await prisma.communicationLog.update({
            where: {
              id: job.data.logId,
            },
            data: {
              status: "FAILED",
            },
          });
          return;
        }
      }

      console.log(
        `[WORKER] Sending Campaign to: ${customer.email}`
      );

      await axios.post(
        `${process.env.CHANNEL_SERVICE_URL}/channel/send`,
        {

          logId:
            job.data.logId,

          customerId:
            job.data.customerId,

          campaignId:
            job.data.campaignId,

          channel:
            campaign.channel,

          customer: {

            name:
              customer.name,

            email:
              customer.email,

            phone:
              customer.phone,

            telegramChatId:
              customer.telegramChatId,

          },

          campaign: {

            name:
              campaign.name,

            message:
              campaign.message,

          },

        }
      );

      await prisma.campaign.update({

        where: {
          id:
            job.data.campaignId,
        },

        data: {
          status: "SENT",
        },

      });

      console.log(
        `[WORKER] Sent to Channel Service`
      );

    },

    {
      connection: {
        url: process.env.REDIS_URL,
      },
    }

  );
worker.on(
  "completed",
  (job) => {

    console.log(
      "[WORKER] Worker Completed - Job " + job.id
    );

  }
);

worker.on(
  "failed",
  (job, err) => {

    console.error(
      "[WORKER] Worker Job Failed - Job " + job.id + ":",
      err.message
    );

  }
);
console.log(
  "[WORKER] Worker Started"
);