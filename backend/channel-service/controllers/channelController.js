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
      "Message Received:",
      req.body
    );

    switch (channel) {

  case "EMAIL":

await sendEmail(
  customer.email,
  campaign.name,
  campaign.message,
  logId
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

    console.log(
      "Unknown Channel"
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
            `Log ${logId} -> DELIVERED`
          );

          // 70% users open mail

        } catch (error) {

          console.error(
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