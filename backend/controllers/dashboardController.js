
const prisma =
  require("../prisma/prismaClient");

const {
  generateCampaignRecommendation,
} = require(
  "../services/aiService"
);

const getDashboardStats =
  async (req, res) => {

    try {

      const totalCustomers =
        await prisma.customer.count();

      const totalCampaigns =
        await prisma.campaign.count();

      const totalMessages =
        await prisma.communicationLog.count();

      const delivered =
        await prisma.communicationLog.count({

          where: {

            status: {
              in: [
                "DELIVERED",
                "OPENED",
                "CLICKED"
              ]
            }

          }

        });

      const opened =
        await prisma.communicationLog.count({

          where: {

            status: {
              in: [
                "OPENED",
                "CLICKED"
              ]
            }

          }

        });

      const clicked =
        await prisma.communicationLog.count({

          where: {
            status: "CLICKED"
          }

        });

      const failed =
        await prisma.communicationLog.count({
          where: {
            status: "FAILED",
          },
        });

      const pending =
        await prisma.communicationLog.count({
          where: {
            status: "PENDING",
          },
        });

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

        totalCustomers,

        totalCampaigns,

        totalMessages,

        delivered,

        opened,

        clicked,

        failed,

        pending,

        openRate,

        ctr,

      });

    } catch (error) {

      console.error("[DASHBOARD] Error fetching dashboard stats:", error);

      res.status(500).json({
        message: error.message,
      });

    }

  };

const getAIRecommendation =
  async (req, res) => {

    try {

      const delivered =
        await prisma.communicationLog.count({

          where: {

            status: {
              in: [
                "DELIVERED",
                "OPENED",
                "CLICKED"
              ]
            }

          }

        });

      const opened =
        await prisma.communicationLog.count({

          where: {

            status: {
              in: [
                "OPENED",
                "CLICKED"
              ]
            }

          }

        });

      const clicked =
        await prisma.communicationLog.count({

          where: {
            status: "CLICKED"
          }

        });

      const failed =
        await prisma.communicationLog.count({
          where: {
            status: "FAILED",
          },
        });

      const customers =
        await prisma.customer.count();

      const campaigns =
        await prisma.campaign.count({
          where: {
            userId: req.user.id
          }
        })

      if (customers === 0 || campaigns === 0 || delivered === 0) {
        return res.status(200).json({
          success: true,
          hasEnoughData: false,
          message: "Not enough campaign data to generate AI recommendations."
        });
      }

      const recommendation =
        await generateCampaignRecommendation({

          customers,

          campaigns,

          delivered,

          opened,

          clicked,

          failed,

        });

      res.status(200).json({
        success: true,
        hasEnoughData: true,
        ...recommendation
      });

    } catch (error) {

      console.error("[DASHBOARD] AI Recommendation error:", error);

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

const getDashboardAnalytics =
  async (req, res) => {

    try {

      const logs =
        await prisma.communicationLog.findMany({

          orderBy: {
            createdAt: "asc"
          }

        });

      const analyticsMap = {};

      logs.forEach((log) => {

        const date =
          new Date(
            log.createdAt
          ).toLocaleDateString();

        if (!analyticsMap[date]) {

          analyticsMap[date] = {

            date,

            delivered: 0,

            opened: 0,

            clicked: 0,

            failed: 0

          };

        }

        switch (log.status) {

          case "DELIVERED":

            analyticsMap[
              date
            ].delivered++;

            break;

          case "OPENED":

            analyticsMap[
              date
            ].delivered++;

            analyticsMap[
              date
            ].opened++;

            break;

          case "CLICKED":

            analyticsMap[
              date
            ].delivered++;

            analyticsMap[
              date
            ].opened++;

            analyticsMap[
              date
            ].clicked++;

            break;

          case "FAILED":

            analyticsMap[
              date
            ].failed++;

            break;

        }

      });

      const analytics =
        Object.values(
          analyticsMap
        );

      res.json(
        analytics
      );

    } catch (error) {

      console.error("[DASHBOARD] Error getting dashboard analytics:", error);

      res.status(500).json({
        message: error.message
      });

    }

  };

module.exports = {
  getDashboardStats,
  getAIRecommendation,
  getDashboardAnalytics
};