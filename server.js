const express = require("express");
const cors = require("cors");

const customerRoutes =
require("./routes/customerRoutes");

const audienceRoutes =
require("./routes/audienceRoutes");

const campaignRoutes =
require("./routes/campaignRoutes");

const analyticsAgentRoutes =
require("./routes/analyticsAgentRoutes");

const dashboardRoutes =
require("./routes/dashboardRoutes");

const authRoutes =
require("./routes/authRoutes");

const agentRoutes =
require("./routes/agentRoutes");

const trackingRoutes = require("./routes/trackingRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/customers", customerRoutes);
app.use("/audience", audienceRoutes);
app.use("/campaigns", campaignRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/auth", authRoutes);
app.use("/agents", agentRoutes);
app.use("/analytics-agent",analyticsAgentRoutes);
app.use("/tracking",trackingRoutes);

app.get("/", (req, res) => {
  res.send("CRM Backend Running");
});


const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});