const express = require("express");

const {
  getCustomers,
  getCustomerById,
  getHighSpenders,
  filterCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const {
  generateInvite,
  disconnectTelegram,
  getConnectionStatus,
} = require("../controllers/telegramController");

const authMiddleware =
  require("../middleware/authMiddleware");

const router =
  express.Router();

router.use(authMiddleware);

router.get("/", getCustomers);

router.post("/",createCustomer);

router.put("/:id", updateCustomer);

router.delete("/:id",deleteCustomer);

router.post("/:id/telegram/connect", generateInvite);
router.post("/:id/telegram/disconnect", disconnectTelegram);
router.get("/:id/telegram/status", getConnectionStatus);

router.get(
  "/high-spenders",
  getHighSpenders
);

router.get(
  "/filter",
  filterCustomers
);

router.get(
  "/:id",
  getCustomerById
);

router.use(authMiddleware);

module.exports = router;