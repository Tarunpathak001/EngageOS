const express =
  require("express");

const router =
  express.Router();

const {
  trackOpen,
   trackClick
} = require(
  "../controllers/trackingController"
);

router.get(
  "/open/:logId",
  trackOpen
);

router.get(
  "/click/:logId",
  trackClick
);

module.exports =
  router;