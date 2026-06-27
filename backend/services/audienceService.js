const prisma =
  require("../prisma/prismaClient");

const buildAudience =
async (filters) => {

  const whereClause = {};

  if (filters.city) {

    whereClause.city = {

      equals:
        filters.city.trim(),

      mode:
        "insensitive"

    };

  }

  if (filters.minSpend) {

    whereClause.totalSpend = {

      gte:
        Number(
          filters.minSpend
        )

    };

  }

  const customers =
    await prisma.customer.findMany({

      where:
        whereClause,

      include: {

        orders: true

      }

    });

  return customers;

};

module.exports = {
  buildAudience,
};