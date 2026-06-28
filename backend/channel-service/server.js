const express = require("express");
const cors = require("cors");

require("dotenv").config();

const channelRoutes = require("./routes/channelRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    service: "EngageOS Channel Service",
    status: "Healthy",
    version: "1.0.0",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/channel", channelRoutes);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`[SERVER] Channel Service Running On Port ${PORT}`);
});