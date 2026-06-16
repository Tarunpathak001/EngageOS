const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  executeAgent
} = require("../controllers/agentController");

router.post(
  "/execute",
  authMiddleware,
  executeAgent
);

module.exports = router;