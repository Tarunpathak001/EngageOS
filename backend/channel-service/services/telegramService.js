const axios = require("axios");

const sendTelegram = async (
  chatId,
  message
) => {

  if (!chatId) {
    throw new Error(
      "Customer has no Telegram Chat ID"
    );
  }

  await axios.post(

`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,

{
chat_id: chatId,
text: message,
}

);

  console.log(
    "[TELEGRAM] Campaign Sent"
  );

};

module.exports = {
  sendTelegram,
};
