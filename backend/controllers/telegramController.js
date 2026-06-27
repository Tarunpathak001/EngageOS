const prisma = require("../prisma/prismaClient");
const telegramService = require("../services/telegramService");
const { sendTelegramInviteEmail } = require("../services/emailService");

const generateInvite = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({
      where: { id: Number(id) },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const result = await telegramService.generateInviteToken(id);

    // Send email automatically
    await sendTelegramInviteEmail(customer.email, customer.name, result.inviteLink);

    console.log("[TELEGRAM] Invitation Email Sent");

    res.json({
      success: true,
      message: "Telegram invitation sent successfully.",
      expiresAt: result.expiresAt,
    });
  } catch (error) {
    console.error("[TELEGRAM] Error generating invite token:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const disconnectTelegram = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await telegramService.disconnectTelegram(id);
    res.json(result);
  } catch (error) {
    console.error("[TELEGRAM] Error disconnecting telegram:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getConnectionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await telegramService.getTelegramStatus(id);
    res.json(result);
  } catch (error) {
    console.error("[TELEGRAM] Error fetching connection status:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const handleWebhook = async (req, res) => {
  try {
    const update = req.body;
    await telegramService.handleTelegramUpdate(update);
    res.sendStatus(200);
  } catch (error) {
    console.error("[TELEGRAM] Webhook handling error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateInvite,
  disconnectTelegram,
  getConnectionStatus,
  handleWebhook,
};
