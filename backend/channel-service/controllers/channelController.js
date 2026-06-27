const axios = require("axios");


const {
  sendEmail,
} = require(
  "../services/emailService"
);

const {
  sendSMS,
} = require(
  "../services/smsService"
);

const {
  sendWhatsApp,
} = require(
  "../services/whatsappService"
);

const {
  sendTelegram,
} = require(
  "../services/telegramService"
);


const sendMessage =
  async (req, res) => {

    const {
      logId,
      customerId,
      campaignId,
      channel,
      customer,
      campaign,

    } = req.body;

    console.log(
      `[EMAIL] Message Received: logId=${logId}, channel=${channel}`
    );


    switch (channel.toUpperCase()) {

      case "EMAIL":

        await sendEmail(
          customer.email,
          campaign.name,
          campaign.message,
          logId
        );

        break;

      case "TELEGRAM":

        await sendTelegram(
          customer.telegramChatId,
          campaign.message
        );

        break;

      case "SMS":

        await sendSMS(

          customer.phone,

          campaign.message

        );

        break;

      case "WHATSAPP":

        await sendWhatsApp(

          customer.phone,

          campaign.message

        );

        break;

      default:

        console.warn(
          `[EMAIL] Unknown Channel: ${channel}`
        );

    }

    res.status(200).json({
      success: true
    });

    setTimeout(
      async () => {

        try {

          // DELIVERED
          await axios.post(
            "http://localhost:5000/campaigns/receipt",
            {
              logId,
              customerId,
              campaignId,
              status: "DELIVERED"
            }
          );

          console.log(
            `[EMAIL] Log ${logId} -> DELIVERED`
          );

          // 70% users open mail

        } catch (error) {

          console.error(
            "[EMAIL] Error sending receipt callback:",
            error.message
          );

        }

      },
      2000
    );

  };

module.exports = {
  sendMessage
};