
const { GoogleGenerativeAI } =
  require("@google/generative-ai");

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

const model =
  genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

const parseAudiencePrompt =
  async (prompt) => {

    for (let attempt = 1; attempt <= 3; attempt++) {

      try {

        const result =
          await model.generateContent(`
You are an autonomous CRM Marketing Agent.

Your job is to:

1. Understand the user's marketing goal.
2. Identify the correct audience.
3. Create audience filters.
4. Select the best campaign.
5. Generate a marketing message.

Available Customer Fields:

- city
- totalSpend
- segment

Return ONLY valid JSON.

Schema:
{
  "city": string | null,
  "minSpend": number | null,
  "segment": string | null
}

Segment Rules:

VIP:
totalSpend >= 10000

Premium:
totalSpend >= 5000 and < 10000

Regular:
totalSpend < 5000

IMPORTANT:

If a city name appears anywhere in the request,
it MUST be used as an audience filter.

Never ignore city names.

Examples:

User:
Bring back all Pune customers

Output:
{
  "city":"Pune",
  "minSpend":null,
  "segment":null
}

User:
Send offer to Delhi customers

Output:
{
  "city":"Delhi",
  "minSpend":null,
  "segment":null
}

User:
Target VIP customers

Output:
{
  "city":null,
  "minSpend":10000,
  "segment":"VIP"
}

User:
Target Premium customers from Bangalore

Output:
{
  "city":"Bangalore",
  "minSpend":5000,
  "segment":"Premium"
}

Return ONLY valid JSON.

User Request:
${prompt}


`);

        const response =
          result.response.text();

        console.log(
          "[AI] Gemini Raw Response:",
          response
        );

        const cleaned =
          response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleaned);

      } catch (error) {

        console.error(
          `[AI] Attempt ${attempt} Failed:`,
          error.message
        );

        if (attempt < 3) {

          await new Promise(
            resolve =>
              setTimeout(resolve, 2000)
          );

        }

      }

    }



    console.log(
      "[AI] Using Fallback Audience Parser"
    );

    const spendMatch =
      prompt.match(/\d+/);

    const lowerPrompt =
      prompt.toLowerCase();

    let city = null;

    const stopWords = [

      "bring",
      "back",
      "all",
      "find",
      "customer",
      "customers",
      "send",
      "offer",
      "target",
      "vip",
      "premium",
      "regular",
      "from",
      "to",
      "and",
      "with",
      "campaign",
      "email",
      "mail",
      "message"

    ];

    const words =
      lowerPrompt.match(/[a-z]+/g) || [];

    for (const word of words) {

      if (!stopWords.includes(word)) {

        city = word;
        break;

      }

    }

    return {

      city,

      minSpend:
        spendMatch
          ? Number(spendMatch[0])
          : null,

      segment:
        lowerPrompt.includes("vip")
          ? "VIP"
          : lowerPrompt.includes("premium")
            ? "Premium"
            : lowerPrompt.includes("regular")
              ? "Regular"
              : null

    };

  };

const generateCampaignContent =
  async (goal) => {

    for (
      let attempt = 1;
      attempt <= 3;
      attempt++
    ) {

      try {

        const result =
          await model.generateContent(`
You are a senior CRM marketing strategist.

Create a highly engaging marketing campaign.

Return ONLY valid JSON.

{
  "name": "",
  "message": ""
}

Rules:

1. Campaign name must be catchy and professional.
2. Message should sound like a real marketing email.
3. Use persuasive copywriting.
4. Create urgency when relevant.
5. Focus on customer benefits.
6. Keep message under 120 words.
7. Add a clear call-to-action.
8. Do not use placeholders.

Goal:
${goal}
`);

        const response =
          result.response.text();

        console.log(
          "[AI] Campaign Response:",
          response
        );

        const cleaned =
          response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(
          cleaned
        );

      } catch (error) {

        console.error(
          `[AI] Campaign Attempt ${attempt} Failed:`,
          error.message
        );

        if (attempt < 3) {

          await new Promise(
            resolve =>
              setTimeout(
                resolve,
                2000
              )
          );

        }

      }

    }

    console.log(
      "[AI] Using Fallback Campaign"
    );

    return {

      name:
        "Weekend Special Offer",

      message:
        "Dear Customer,\n\nEnjoy exclusive discounts this weekend on our most popular products. This limited-time offer ends soon, so don't miss your chance to save.\n\nShop now and make the most of this special deal.\n\nRegards,\nEngageOS",

    };

  };

const generateCampaignRecommendation =
  async (campaignData) => {

    for (
      let attempt = 1;
      attempt <= 3;
      attempt++
    ) {

      try {

        const result =
          await model.generateContent(`

You are a CRM analytics expert.

Analyze this campaign data and return ONLY valid JSON.

{
  "bestChannel": "",
  "recommendedAudience": "",
  "expectedOpenRate": "",
  "reason": ""
}

Campaign Data:

${JSON.stringify(campaignData)}

`);

        const response =
          result.response.text();

        console.log(
          "[AI] Recommendation Response:",
          response
        );

        const cleaned =
          response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(
          cleaned
        );

      } catch (error) {

        console.error(
          `[AI] Recommendation Attempt ${attempt} Failed:`,
          error.message
        );

        if (attempt < 3) {

          await new Promise(
            resolve =>
              setTimeout(
                resolve,
                2000
              )
          );

        }

      }

    }

    console.log(
      "[AI] Using Fallback Recommendation"
    );

    return {

      bestChannel:
        "EMAIL",

      recommendedAudience:
        "High Value Customers",

      expectedOpenRate:
        "40%",

      reason:
        "Gemini unavailable, fallback recommendation used."

    };

  };


const askAnalyticsAI =
  async (
    question,
    campaignData
  ) => {

    try {

      const result =
        await model.generateContent(`

You are a senior CRM strategist.

Analyze campaign performance.

Answer the user's question.

Question:
${question}

Campaign Data:
${JSON.stringify(campaignData)}

Return ONLY text.

`);

      return result
        .response
        .text();

    }
    catch (error) {

      return
      "Unable to analyze campaigns currently.";

    }

  };

module.exports = {
  parseAudiencePrompt,
  generateCampaignContent,
  generateCampaignRecommendation,
  askAnalyticsAI
};