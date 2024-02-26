import express from "express";
import AsyncExitHook from "async-exit-hook";
import { CLOSE_DB, CONNECT_DB, GET_DB } from "~/config/mongodb";
import { env } from "~/config/environtment";
import { APIs_V1 } from "~/routes/v1";

const START_SERVER = () => {
  const hostname = env.APP_HOST;
  const port = env.APP_PORT;
  const app = express();

  // Bật kiểu req json
  app.use(express.json());
  // router
  app.use("/v1", APIs_V1);

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
