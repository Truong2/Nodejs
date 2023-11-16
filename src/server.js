const express = require("express");

const mongoose = require("mongoose");


require('dotenv').config();
const app = express();

const port = process.env.APP_PORT;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/ChamSocSucKhoe')
  .then(() => { console.log("DB connected!!!!!") })
  .catch(() => console.log("DB connect failed!!!!"))


var authRoute = require('./routes/auth');
app.use('/api', authRoute);

app.listen(port, process.env.APP_HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`server is running at ${process.env.APP_HOST}:${port}`);
});
