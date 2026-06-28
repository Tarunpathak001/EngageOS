const axios = require("axios");
const crypto = require("crypto");
const prisma = require("../prisma/prismaClient");

let botUsername = null;

const generateInviteToken = async (customerId) => {
  const customer = await prisma.customer.findUnique({
    where: { id: Number(customerId) },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  let token = customer.telegramInviteToken;
  let expiresAt = customer.telegramInviteExpiresAt;

  const now = new Date();
  const isExpired = !expiresAt || now > new Date(expiresAt);

  if (isExpired || !token) {
    token = crypto.randomUUID();
    expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.customer.update({
      where: { id: Number(customerId) },
      data: {
        telegramInviteToken: token,
        telegramInviteExpiresAt: expiresAt,
      },
    });

    console.log("[TELEGRAM] Invitation Generated");
  } else {
    console.log(`[TELEGRAM] Reusing valid existing invitation for Customer ID ${customerId}`);
  }

  const inviteLink = botUsername
    ? `https://t.me/${botUsername}?start=${token}`
    : `https://t.me/EngageOSBot?start=${token}`; // fallback

  return {
    inviteLink,
    expiresAt,
  };
};

const disconnectTelegram = async (customerId) => {
  const customer = await prisma.customer.findUnique({
    where: { id: Number(customerId) },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  await prisma.customer.update({
    where: { id: Number(customerId) },
    data: {
      telegramChatId: null,
      telegramUsername: null,
      telegramConnected: false,
      telegramConnectedAt: null,
      telegramInviteToken: null,
      telegramInviteExpiresAt: null,
    },
  });

  console.log("[TELEGRAM] Telegram Disconnected");
  return { success: true, message: "Telegram account unlinked successfully." };
};

const getTelegramStatus = async (customerId) => {
  const customer = await prisma.customer.findUnique({
    where: { id: Number(customerId) },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  return {
    connected: customer.telegramConnected,
    connectedAt: customer.telegramConnectedAt,
    username: customer.telegramUsername,
  };
};

const sendBotMessage = async (chatId, text) => {
  if (!process.env.TELEGRAM_BOT_TOKEN) return;
  try {
    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text,
      }
    );
  } catch (error) {
    console.error(`[TELEGRAM] Error sending Telegram reply:`, error.message);
  }
};

const linkTelegramAccount = async (chatId, username, token) => {
  const customer = await prisma.customer.findFirst({
    where: { telegramInviteToken: token },
  });

  if (!customer) {
    console.log("[TELEGRAM] Invalid Token");
    await sendBotMessage(chatId, "❌ Invalid or expired invite link. Please request a new link from the EngageOS dashboard.");
    return;
  }

  if (customer.telegramInviteExpiresAt && new Date() > new Date(customer.telegramInviteExpiresAt)) {
    console.log("[TELEGRAM] Invitation Expired");
    await sendBotMessage(chatId, "❌ This invite link has expired. Please request a new one from the dashboard.");
    return;
  }

  await prisma.customer.update({
    where: { id: customer.id },
    data: {
      telegramChatId: chatId,
      telegramUsername: username,
      telegramConnected: true,
      telegramConnectedAt: new Date(),
      telegramInviteToken: null,
      telegramInviteExpiresAt: null,
    },
  });

  console.log("[TELEGRAM] Telegram Connected");
  await sendBotMessage(chatId, `🟢 Success! Your account has been linked to EngageOS CRM.\nCustomer Name: ${customer.name}\nEmail: ${customer.email}`);
};

const unlinkTelegramAccount = async (chatId) => {
  const customer = await prisma.customer.findFirst({
    where: { telegramChatId: chatId },
  });

  if (customer && customer.telegramConnected) {
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        telegramChatId: null,
        telegramUsername: null,
        telegramConnected: false,
        telegramConnectedAt: null,
        telegramInviteToken: null,
        telegramInviteExpiresAt: null,
      },
    });

    console.log("[TELEGRAM] Telegram Disconnected");
    await sendBotMessage(chatId, "🔴 Successfully disconnected your CRM profile from this Telegram account.");
  } else {
    await sendBotMessage(chatId, "❌ This Telegram account is not linked to any CRM profile.");
  }
};

const checkStatusAndReply = async (chatId) => {
  const customer = await prisma.customer.findFirst({
    where: { telegramChatId: chatId },
  });

  if (customer && customer.telegramConnected) {
    await sendBotMessage(chatId, `🟢 Linked to EngageOS CRM\nCustomer Name: ${customer.name}\nEmail: ${customer.email}`);
  } else {
    await sendBotMessage(chatId, "❌ This Telegram account is not linked to any CRM profile.");
  }
};

const handleTelegramUpdate = async (update) => {
  if (!update.message || !update.message.text) return;

  const { chat, text, from } = update.message;
  const chatId = String(chat.id);
  const username = from.username || null;
  const messageText = text.trim();

  const parts = messageText.split(/\s+/);
  const command = parts[0].toLowerCase();
  const arg = parts.slice(1).join(" ");

  try {
    if (command === "/start") {
      if (arg) {
        await linkTelegramAccount(chatId, username, arg);
      } else {
        await sendBotMessage(chatId, "Welcome to EngageOS Bot! To link your CRM customer profile, please click the 'Connect Telegram' button on your CRM customer detail page.");
      }
    } else if (command === "/help") {
      await sendBotMessage(chatId,
        "EngageOS Bot Commands:\n" +
        "/start <token> - Link your CRM profile\n" +
        "/status - Check connection status\n" +
        "/unlink - Disconnect your profile\n" +
        "/help - Show this message"
      );
    } else if (command === "/status") {
      await checkStatusAndReply(chatId);
    } else if (command === "/unlink") {
      await unlinkTelegramAccount(chatId);
    } else {
      await sendBotMessage(chatId, "Unknown command. Type /help to see available commands.");
    }
  } catch (error) {
    console.error("[TELEGRAM] Error handling message:", error.message);
  }
};

let offset = 0;

const startPolling = async () => {
  console.log("[TELEGRAM] Started Long Polling updates...");
  while (true) {
    try {
      const response = await axios.get(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getUpdates`,
        {
          params: {
            offset,
            timeout: 30,
          },
          timeout: 35000,
        }
      );

      const updates = response.data.result;
      for (const update of updates) {
        offset = update.update_id + 1;
        await handleTelegramUpdate(update);
      }
    } catch (error) {
      if (error.code !== "ECONNABORTED" && error.response?.status !== 409) {
        console.error("[TELEGRAM] Long polling error:", error.message);
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

const initBot = async () => {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.warn("[TELEGRAM] Warning: TELEGRAM_BOT_TOKEN not configured.");
    return;
  }

  try {
    const response = await axios.get(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getMe`);
    botUsername = response.data.result.username;
    console.log(`[TELEGRAM] Bot Initialized: @${botUsername}`);
  } catch (error) {
    console.error("[TELEGRAM] Error fetching bot info:", error.message);
  }

  if (process.env.TELEGRAM_POLLING === "true") {
    startPolling();
  }
};

module.exports = {
  generateInviteToken,
  disconnectTelegram,
  getTelegramStatus,
  handleTelegramUpdate,
  initBot,
};
