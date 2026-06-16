const express =
  require("express");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  getDashboardStats,
  getAIRecommendation,
  getDashboardAnalytics
} = require(
  "../controllers/dashboardController"
);

const router =
  express.Router();

router.use(authMiddleware);

router.get(
  "/stats",
  getDashboardStats
);

router.get(
  "/analytics",
  getDashboardAnalytics
);

router.get(
  "/recommendation",
  getAIRecommendation
);

module.exports =
  router;