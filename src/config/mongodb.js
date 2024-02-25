import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "./environtment";

let trelloDbInstance = null;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// Khởi tạo đối tượng client để connect tới db
const client = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const CONNECT_DB = async () => {
  // Kết nối db
  await client.connect();
  trelloDbInstance = client.db(env.DATABASE_NAME);
};

export const GET_DB = () => {
  if (!trelloDbInstance) throw new Error("Must connect to DB first");
  return trelloDbInstance;
};

export const CLOSE_DB = async () => {
  await client.close();
};
