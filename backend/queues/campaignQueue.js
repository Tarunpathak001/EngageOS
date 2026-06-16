require("dotenv").config();

const { Queue } =
  require("bullmq");

const campaignQueue =
  new Queue(
    "campaignQueue",
    {
      connection: {
        url:
          process.env.REDIS_URL,
      },
    }
  );

module.exports =
  campaignQueue;