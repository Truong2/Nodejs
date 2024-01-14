const express = require("express");
const cors = require("cors");
const fs = require('fs')
const path = require('path')
const mongoose = require("mongoose");
require("express-async-errors");

require("dotenv").config();
const app = express();

app.use(cors());




const port = process.env.APP_PORT;

app.use(express.raw());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Xử lý error

var morgan = require('morgan')
app.use(morgan('short'))


// connect db
mongoose
  .connect(
    "mongodb+srv://chamsocsuckhoe:cssk123@chamsocsuckhoe.evqmxbw.mongodb.net/cham_soc_suc_khoe?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB connected!!!!!");
  })
  .catch(() => console.log("DB connect failed!!!!"));

var authRoute = require("./routes/routes");
app.use("/api", authRoute);

app.listen(port, process.env.APP_HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`server is running at ${process.env.APP_HOST}:${port}`);
});

app.listen(port, process.env.IPADDRESS, () => {
  console.log(`Server is running on http://${process.env.IPADDRESS}:${port}`);
});