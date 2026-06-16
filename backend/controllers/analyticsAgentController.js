const prisma =
  require("../prisma/prismaClient");

const {
  generateCampaignRecommendation
} =
require("../services/aiService");

const askAnalyticsAgent =
async (req,res)=>{

  try{

    const { question } =
      req.body;

    const campaigns =
      await prisma.campaign.findMany({

        include:{
          communicationLogs:true
        },

        orderBy:{
          createdAt:"desc"
        },

        take:20

      });

    const recommendation =
      await generateCampaignRecommendation({

        question,

        campaigns

      });

    res.json(
      recommendation
    );

  }
  catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};

module.exports = {
  askAnalyticsAgent
};