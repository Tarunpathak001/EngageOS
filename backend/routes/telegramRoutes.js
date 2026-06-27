const express = require("express");
const router = express.Router();
const { handleWebhook } = require("../controllers/telegramController");

// Public webhook endpoint
router.post("/webhook", handleWebhook);

module.exports = router;
