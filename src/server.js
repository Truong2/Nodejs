import express from "express";
import AsyncExitHook from "async-exit-hook";
import { CLOSE_DB, CONNECT_DB, GET_DB } from "~/config/mongodb";
import { env } from "~/config/environtment";

const START_SERVER = () => {
  const app = express();

  const hostname = env.APP_HOST;
  const port = env.APP_PORT;

  app.get("/", async (req, res) => {
    // Test Absolute import mapOrder
    console.log(await GET_DB().listCollections().toArray());
    res.end("<h1>Hello World!</h1><hr>");
  });

  app.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello Truong Nguyen , I am running at ${hostname}:${port}/`);
  });

  AsyncExitHook(() => {
    console.log("Exiting app");
    CLOSE_DB();
  });
};

CONNECT_DB()
  .then(() => console.log("Connected to db successfully"))
  .then(() => START_SERVER())
  .catch((error) => {
    console.log("error: ", error);
    process.exit(0);
  });
