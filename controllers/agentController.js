const {
  parseAudiencePrompt,
  generateCampaignContent,
  generateCampaignRecommendation
} = require("../services/aiService");

const prisma =
  require("../prisma/prismaClient");

  const axios =
  require("axios");

const executeAgent =
  async (req, res) => {

    try {

      const { goal } =
        req.body;

      const audience =
        await parseAudiencePrompt(
          goal
        );

      console.log(
        "Parsed Audience:",
        audience
      );

      console.log(
  "AUDIENCE TYPE:",
  typeof audience
);

console.log(
  "AUDIENCE JSON:",
  JSON.stringify(
    audience,
    null,
    2
  )
);

      const where = {};

if (audience.city) {

  where.city = {

    equals: audience.city.trim(),

    mode: "insensitive"

  };

}
console.log(
  "FINAL WHERE:",
  JSON.stringify(where, null, 2)
);

      if (
        audience.minSpend
      ) {

        where.totalSpend = {

          gte:
            audience.minSpend,

        };

      }

      if (
        audience.segment ===
        "VIP"
      ) {

        where.totalSpend = {

          gte: 10000,

        };

      }

      if (
        audience.segment ===
        "Premium"
      ) {

        where.totalSpend = {

          gte: 5000,
          lt: 10000,

        };

      }

      if (
        audience.segment ===
        "Regular"
      ) {

        where.totalSpend = {

          lt: 5000,

        };

      }

      console.log(
        "Where Clause:",
        where
      );

      const matchedCustomers =
        await prisma.customer.findMany({

          where,

        });

      console.log(
        "Customers Found:",
        matchedCustomers.length
      );

      const campaign =
        await generateCampaignContent(
          goal
        );

      const recommendation =
        await generateCampaignRecommendation({

          goal,
          audience,
          campaign,

        });

      const savedCampaign =
        await prisma.campaign.create({

          data: {

            name:
              campaign.name,

            message:
              campaign.message,

            channel:
              recommendation.bestChannel
                || "EMAIL",

            status:
              "DRAFT",

          },

        });

      await axios.post(

        `http://localhost:5000/campaigns/${savedCampaign.id}/send`,

        {
          customerIds:
            matchedCustomers.map(
              customer =>
                customer.id
            ),
        },

        {
          headers: {

            Authorization:
              req.headers.authorization,

          },
        }

      );

      res.json({

        success: true,

        message:
          "AI Agent generated and sent campaign",

        audience,

        matchedCustomers:
          matchedCustomers.length,

        campaign,

        recommendation,

        savedCampaign,

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

};

module.exports = {
  executeAgent
};