const prisma =
  require("../prisma/prismaClient");

const campaignQueue =
  require("../queues/campaignQueue");

setInterval(async () => {

  try {

    const campaigns =
      await prisma.campaign.findMany({

        where: {

          status: "SCHEDULED",

          scheduledAt: {
            lte: new Date()
          }

        }

      });

    for (const campaign of campaigns) {

      console.log(
        `Running Campaign ${campaign.id}`
      );

      const customers =
        await prisma.customer.findMany();

      for (const customer of customers) {

        const log =
          await prisma.communicationLog.create({

            data: {

              campaignId:
                campaign.id,

              customerId:
                customer.id,

              status:
                "PENDING"

            }

          });

        await campaignQueue.add(
          "send-message",
          {

            logId:
              log.id,

            customerId:
              customer.id,

            campaignId:
              campaign.id,

          }
        );

      }

      await prisma.campaign.update({

        where: {
          id: campaign.id
        },

        data: {
          status: "PROCESSING"
        }

      });

    }

  } catch (error) {

    console.log(
      error.message
    );

  }

}, 30000);

console.log(
  "Scheduler Worker Started"
);