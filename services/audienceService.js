
const prisma =
  require("../prisma/prismaClient");

console.log(
  "AUDIENCE SERVICE LOADED"
);

const buildAudience =
async (filters) => {

  console.log(
    "Audience Filters:",
    filters
  );

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

  console.log(
    "Where Clause:",
    whereClause
  );

  console.log(
    "FILTER CITY:",
    filters.city
  );

  console.log(
    "CITY LENGTH:",
    filters.city
      ? filters.city.length
      : "NULL"
  );

  console.log(
    "CITY VALUE:",
    JSON.stringify(
      filters.city
    )
  );

  const testDelhi =
  await prisma.customer.findMany({
    where: {
      city: "Delhi"
    }
  });

console.log(
  "DELHI TEST:",
  testDelhi.length
);

const testPune =
  await prisma.customer.findMany({
    where: {
      city: "pune"
    }
  });

console.log(
  "PUNE TEST:",
  testPune.length
);

  const allCustomers =
    await prisma.customer.findMany();

  console.log(
    "ALL CUSTOMERS:"
  );

  allCustomers.forEach(c => {

    console.log({

      id: c.id,

      city: c.city,

      cityLength:
        c.city
          ? c.city.length
          : 0

    });

  });

  const customers =
    await prisma.customer.findMany({

      where:
        whereClause,

      include: {

        orders: true

      }

    });

  console.log(
    "MATCHED CUSTOMERS:",
    customers
  );

  console.log(
    "Customers Found:",
    customers.length
  );

  return customers;

};

console.log(
  "AUDIENCE SERVICE VERSION 999"
);

module.exports = {
  buildAudience,
};