const express = require("express");
const cors = require("cors");
const fs = require('fs')
const path = require('path')
const mongoose = require("mongoose");
const morgan = require('morgan')

require("dotenv").config();

var corsOptions = {
  origin: 'http://example.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const app = express();
const port = process.env.APP_PORT;
app.use(cors())
app.use(express.raw());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
  console.log(`server is running at ${process.env.APP_HOST}:${port}`);
});

app.listen(port, process.env.IPADDRESS, () => {
  console.log(`Server is running on http://${process.env.IPADDRESS}:${port}`);
});

app.listen(port, '127.0.0.1', () => {
  console.log(`Server is running on http://${"127.0.0.1"}:${port}`);
});