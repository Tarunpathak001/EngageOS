const express = require("express");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  createCampaign,
  getCampaigns,
  sendCampaign,
  getCampaignLogs,
  getCampaignStats,
  generateCampaign,
  campaignReceipt,
  getCampaignById,
  deleteCampaign
} = require("../controllers/campaignController");

const {
  trackOpen
} = require(
  "../controllers/trackingController"
);

const router =
  express.Router();

router.post(
  "/receipt",
  campaignReceipt
);

router.get(
  "/track/open/:logId",
  trackOpen
);

router.use(
  authMiddleware
);

router.get(
  "/",
  getCampaigns
);

router.get(
  "/:id",
  getCampaignById
);

router.get(
  "/:id/logs",
  getCampaignLogs
);

router.get(
  "/:id/stats",
  getCampaignStats
);

router.post(
  "/",
  createCampaign
);

router.post(
  "/:id/send",
  sendCampaign
);

router.post(
  "/ai-generate",
  generateCampaign
);

router.delete(
  "/:id",
  deleteCampaign
);


module.exports =
  router;