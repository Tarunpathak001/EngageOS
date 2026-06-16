const {
  buildAudience,
} = require("../services/audienceService");

const {
  parseAudiencePrompt,
} = require("../services/aiService");

const previewAudience =
  async (req, res) => {

    try {

      const customers =
        await buildAudience(req.query);

      res.status(200).json({
        audienceSize:
          customers.length,

        customers,
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }
};
const previewAudienceFromPrompt =
  async (req, res) => {

    try {

      const { prompt } = req.body;

      const filters =
        await parseAudiencePrompt(
          prompt
        );

        console.log(
  "AI FILTERS:",
  filters
);


      const customers =
        await buildAudience(
          filters
        );

      res.status(200).json({

        prompt,

        filters,

        audienceSize:
          customers.length,

        customers,

      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
        
    }

};

module.exports = {
  previewAudience,
  previewAudienceFromPrompt,
};