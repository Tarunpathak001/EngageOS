const express =
  require("express");

const router =
  express.Router();

const {
  askAnalyticsAgent
} = require(
  "../controllers/analyticsAgentController"
);

router.post(
  "/ask",
  askAnalyticsAgent
);

module.exports =
  router;