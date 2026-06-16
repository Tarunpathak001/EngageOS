const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
  previewAudience,
  previewAudienceFromPrompt,
} = require("../controllers/audienceController");

const router = express.Router();

router.get("/preview", previewAudience);
router.post("/ai-preview",previewAudienceFromPrompt);

router.use(authMiddleware);

module.exports = router;
