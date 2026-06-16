const express = require("express");

const {
  getCustomers,
  getCustomerById,
  getHighSpenders,
  filterCustomers,
  createCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const authMiddleware =
  require("../middleware/authMiddleware");

const router =
  express.Router();

router.use(authMiddleware);

router.get("/", getCustomers);

router.post("/",createCustomer);

router.delete("/:id",deleteCustomer);

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