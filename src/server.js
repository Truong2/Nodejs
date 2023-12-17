const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();
const app = express();
app.use(cors());

const port = process.env.APP_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://chamsocsuckhoe:cssk123@chamsocsuckhoe.evqmxbw.mongodb.net/cham_soc_suc_khoe?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB connected!!!!!");
  })
  .catch(() => console.log("DB connect failed!!!!"));

var authRoute = require("./routes/auth");
app.use("/api", authRoute);

var roleRoute = require("./routes/RoleUser/routes_role");
app.use("/api", roleRoute);

app.listen(port, process.env.APP_HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`server is running at ${process.env.APP_HOST}:${port}`);
});
