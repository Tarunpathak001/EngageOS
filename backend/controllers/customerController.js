const prisma = require("../prisma/prismaClient");

const getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
      orders: true,
    },
});

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCustomerById = async (req, res) => {
  try {

    const customerId =
      parseInt(req.params.id);

    const customer =
      await prisma.customer.findUnique({

        where: {
          id: customerId,
        },

        include: {

          orders: true,

          communicationLogs: {

            include: {
              campaign: true,
            },

            orderBy: {
              createdAt: "desc",
            },

          },

        },

      });

    if (!customer) {

      return res.status(404).json({
        message:
          "Customer not found",
      });

    }

    res.status(200).json(
      customer
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }
};

const getHighSpenders = async (req, res) => {
  try {

    const customers =
      await prisma.customer.findMany({

        where: {
          totalSpend: {
            gt: 5000,
          },
        },

        include: {
          orders: true,
        },

      });

    res.status(200).json(customers);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};
const filterCustomers = async (req, res) => {

  try {

    const { city, minSpend } = req.query;

    const customers =
      await prisma.customer.findMany({

        where: {

          city: city || undefined,

          totalSpend: minSpend
            ? {
                gt: Number(minSpend),
              }
            : undefined,

        },

        include: {
          orders: true,
        },

      });

    res.status(200).json(customers);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

const createCustomer = async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      city,
      totalSpend,
      telegramChatId
    } = req.body;

    if (!name || !email || !city || totalSpend === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required customer fields."
      });
    }

    const customer =
      await prisma.customer.create({

        data: {

          name,

          email,

          phone,

          city,

          totalSpend:
            Number(totalSpend),

          telegramChatId

        }

      });

    res.status(201).json(
      customer
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      city,
      totalSpend,
      telegramChatId
    } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID."
      });
    }

    if (!name || !email || !city || totalSpend === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required customer fields."
      });
    }

    const customer = await prisma.customer.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        email,
        phone,
        city,
        totalSpend: totalSpend !== undefined ? Number(totalSpend) : undefined,
        telegramChatId,
      },
    });

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteCustomer =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      await prisma.communicationLog.deleteMany({
        where: {
          customerId: Number(id),
        },
      });

      await prisma.order.deleteMany({
        where: {
          customerId: Number(id),
        },
      });

      await prisma.customer.delete({
        where: {
          id: Number(id),
        },
      });

      res.json({
        message: "Customer Deleted",
      });

    } catch (error) {

      console.error("[CUSTOMER] Error deleting customer:", error);

      res.status(500).json({
        message: error.message,
      });

    }

};


module.exports = {
  getCustomers,
  getCustomerById,
  getHighSpenders,
  createCustomer,
  updateCustomer,
  filterCustomers,
  deleteCustomer,
};