const express =
  require("express");

const router =
  express.Router();

const {
  executeAgent
} =
require(
  "../controllers/agentController"
);

router.post(
  "/execute",
  executeAgent
);

module.exports =
  router;