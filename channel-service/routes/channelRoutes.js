const express = require("express");

const {
  sendMessage
} = require(
  "../controllers/channelController"
);

const router = express.Router();

router.post(
  "/send",
  sendMessage
);

module.exports = router;