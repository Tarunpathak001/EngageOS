const express = require("express");
const cors = require("cors");

require("dotenv").config();

const channelRoutes =
  require("./routes/channelRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/channel", channelRoutes);

const PORT =
  process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(
    `Channel Service Running On Port ${PORT}`
  );
});