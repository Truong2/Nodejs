import express from "express";
import { boardValidation } from "~/validations/boardValidation";
const Router = express.Router();

Router.route("/")
  .get((req, res) => {
    res.status(200).json({ message: "get board" });
  })
  .post(boardValidation.createNew);

export const boardRoute = Router;
