import express from "express";
import mongoose from "mongoose";
//import { mapOrder } from "~/utils/sorts.js";

const app = express();

const hostname = "localhost";
const port = 8017;

await mongoose.connect('mongodb://localhost:27017/ChamSocSucKhoe')
  .then(() => { app.listen(port, () => console.log("DB connected!!!!!")) })
  .catch(() => console.log("DB connect failed!!!!"))


app.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`server is running at ${hostname}:${port}/`);
});
