const prisma = require("../prisma/prismaClient");

const {
  buildAudience,
} = require("../services/audienceService");

const campaignQueue =
  require("../queues/campaignQueue");

const {
  generateCampaignContent,
} = require("../services/aiService");


const createCampaign = async (req, res) => {
  try {

    const { name, message , channel, scheduledAt,} = req.body;

    const finalScheduledAt =
  scheduledAt
    ? new Date(
        scheduledAt
      )
    : null;

    const campaign =
      await prisma.campaign.create({


data: {

  name,

  message,

  channel,

  scheduledAt: finalScheduledAt,

  status:
    scheduledAt
      ? "SCHEDULED"
      : "DRAFT",

  userId:
    req.user.id,

},

      });

    res.status(201).json(
      campaign
    );

  }catch (error)
{

  console.error(
    "Create Campaign Error:",
    error
  );

  res.status(500).json({
    message:
      error.message,
  });

}
};

const getCampaigns = async (req, res) => {
  try {

    const campaigns =
      await prisma.campaign.findMany({

        where: {
          userId:
            req.user.id,
        },

        include: {
          communicationLogs: true,
        },

        orderBy: {
          createdAt: "desc",
        },

      });

    const analyticsCampaigns =
      campaigns.map((campaign) => {

        const logs =
          campaign.communicationLogs;

const delivered =
  logs.filter(
    log =>
      [
        "DELIVERED",
        "OPENED",
        "CLICKED"
      ].includes(
        log.status
      )
  ).length;

const opened =
  logs.filter(
    log =>
      [
        "OPENED",
        "CLICKED"
      ].includes(
        log.status
      )
  ).length;

const clicked =
  logs.filter(
    log =>
      log.status ===
      "CLICKED"
  ).length;

        const failed =
          logs.filter(
            log =>
              log.status ===
              "FAILED"
          ).length;

        const openRate =
          delivered === 0
            ? 0
            : (
                (opened /
                  delivered) *
                100
              ).toFixed(2);

        const ctr =
          opened === 0
            ? 0
            : (
                (clicked /
                  opened) *
                100
              ).toFixed(2);

        return {

          id:
            campaign.id,

          name:
            campaign.name,

          channel:
            campaign.channel,

          status:
            campaign.status,

          createdAt:
            campaign.createdAt,

          delivered,

          opened,

          clicked,

          failed,

          openRate,

          ctr,

        };

      });

    res.status(200).json(
      analyticsCampaigns
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }
};
const sendCampaign = async (req, res) => {
  console.log(
  "SEND CAMPAIGN HIT"
);
  try {

    const campaignId =
      Number(req.params.id);

    const campaign =
      await prisma.campaign.findUnique({
        where: {
          id: campaignId,
        },
      });

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

 let customers = [];

if (req.body.customerIds) {

  customers =
    await prisma.customer.findMany({

      where: {

        id: {

          in:
            req.body.customerIds,

        },

      },

    });

} else {

  customers =
    await buildAudience(
      req.body
    );

}

console.log(
  "Sending To:",
  customers.map(
    c => ({
      id: c.id,
      city: c.city
    })
  )
);

    const logs = [];

    for (const customer of customers) {

      const log =
        await prisma.communicationLog.create({
          data: {
            campaignId,
            customerId: customer.id,
            status: "PENDING",
          },
        });

const delay =

  campaign.scheduledAt

    ? new Date(
        campaign.scheduledAt
      ).getTime()

      - Date.now()

    : 0;
console.log(
  "ADDING JOB",
  {
    customerId: customer.id,
    campaignId,
    delay
  }
);
await campaignQueue.add(
  "send-message",
  {
    logId: log.id,
    customerId: customer.id,
    campaignId,
  },
  {
    delay:
      delay > 0
        ? delay
        : 0,
  }
);
console.log(
  "ADDING JOB",
  {
    customerId: customer.id,
    campaignId,
    delay
  }
);

      logs.push(log);
    }

    res.status(200).json({
      campaignId,
      campaignName: campaign.name,
      audienceSize: customers.length,
      logsCreated: logs.length,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const getCampaignLogs = async (req, res) => {
  try {

    const campaignId =
      Number(req.params.id);

    const logs =
      await prisma.communicationLog.findMany({

        where: {
          campaignId,
        },

        include: {
          customer: true,
        },

        orderBy: {
          createdAt: "desc",
        },

      });

    res.status(200).json(logs);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const getCampaignStats = async (req, res) => {
  try {

    const campaignId =
      Number(req.params.id);

    const campaign =
      await prisma.campaign.findUnique({

        where: {
          id: campaignId,
        },

        include: {
          communicationLogs: true,
          user: true,
        },

      });

    if (!campaign) {

      return res.status(404).json({
        message: "Campaign not found",
      });

    }

    const logs =
      campaign.communicationLogs;

const totalAudience =
  logs.length;

const delivered =
  logs.filter(
    log =>
      ["DELIVERED", "OPENED", "CLICKED"]
      .includes(log.status)
  ).length;

const opened =
  logs.filter(
    log =>
      ["OPENED", "CLICKED"]
      .includes(log.status)
  ).length;

const clicked =
  logs.filter(
    log =>
      log.status === "CLICKED"
  ).length;

const failed =
  logs.filter(
    log => log.status === "FAILED"
  ).length;

const pending =
  logs.filter(
    log => log.status === "PENDING"
  ).length;

const openRate =
  delivered === 0
    ? 0
    : (
        (opened / delivered) *
        100
      ).toFixed(2);

const ctr =
  opened === 0
    ? 0
    : (
        (clicked / opened) *
        100
      ).toFixed(2);

    res.status(200).json({

      campaignId:
        campaign.id,

      campaignName:
        campaign.name,

      channel:
        campaign.channel,

      createdAt:
        campaign.createdAt,

      createdBy:
        campaign.user?.name ||
        "Unknown",

      totalAudience,

delivered,

opened,

clicked,

failed,

pending,

openRate:
  `${openRate}%`,

ctr:
  `${ctr}%`,

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const getCampaignById =
async (req,res)=>{

  try{

    const campaignId =
      Number(
        req.params.id
      );

    const campaign =
      await prisma.campaign.findUnique({

        where:{
          id:campaignId
        },

        include:{

          communicationLogs:{

            include:{
              customer:true
            },

            orderBy:{
              createdAt:"desc"
            }

          }

        }

      });

    if(!campaign){

      return res.status(404).json({

        message:
          "Campaign not found"

      });

    }

    res.json(
      campaign
    );

  }
  catch(error){

    res.status(500).json({

      message:
        error.message

    });

  }

};

const generateCampaign =
  async (req, res) => {

    try {

      const { goal } = req.body;

      const campaign =
        await generateCampaignContent(
          goal
        );

      res.status(200).json(
        campaign
      );

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }
};

const campaignReceipt =
  async (req, res) => {

    try {

      const {
        logId,
        status
      } = req.body;

      await prisma.communicationLog.update({

        where: {
          id: logId
        },

        data: {
          status
        }

      });

      res.status(200).json({
        success: true
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

};

const deleteCampaign =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      await prisma.communicationLog.deleteMany({
        where: {
          campaignId: Number(id),
        },
      });

      await prisma.campaign.delete({
        where: {
          id: Number(id),
        },
      });

      res.json({
        message: "Campaign Deleted",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message,
      });

    }

};

module.exports = {
  createCampaign,
  getCampaigns,
  sendCampaign,
  getCampaignLogs,
  getCampaignStats,
  getCampaignById,
  generateCampaign,
  campaignReceipt,
  deleteCampaign,
};