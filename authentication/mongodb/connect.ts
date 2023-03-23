import { MongoClient } from "mongodb";

class MongoDBConnection {
  constructor() {}
  async connect() {
    const url = process.env.MONGODB_CONNECTION_STRING;
    const client = new MongoClient(url);

    try {
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log("succesfully connected to :", url);
    } catch (error) {
      console.dir(error);
      await client.close();
    }
  }
}
