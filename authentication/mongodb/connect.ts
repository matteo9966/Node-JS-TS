import { MongoClient } from "mongodb";
import { Model } from "./models/Model";

export type MongoDbConnectionType = MongoDBConnection

type ModelClass = { new (name:string,mongo:MongoDBConnection): {} }
class MongoDBConnection {

  client:MongoClient|null = null;
  connected=false;

  //una mappa con tutti i model, che se non sono definiti gli definisco quando faccio getModel


  constructor() {}
  async connect() {
    const url = process.env.MONGODB_CONNECTION_STRING;
    const client = new MongoClient(url);

    try {
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      this.client=client;
      this.connected=true
      console.log('connected to mongodb')
    } catch (error) {
      console.dir(error);
      this.connected=false
      await client.close();
    }
  }

  createModel<T extends Model<any>>(name:string,model:ModelClass){

     return new model(name,this) as T;

  }


}


const mongoConnection = new MongoDBConnection();

export {mongoConnection}

