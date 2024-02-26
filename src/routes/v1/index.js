import express from "express";
import { boardRoute } from "./boardRoute";

const Router = express.Router();

// Kiểm tra api
Router.get("/status", (req, res) => {
  res.status(200).json({ message: "APIs V1" });
});

/* Board APIs */
Router.use("/boards", boardRoute);

export const APIs_V1 = Router;
