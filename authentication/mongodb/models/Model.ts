import { Filter, Document, OptionalUnlessRequiredId } from "mongodb";
import { MongoDbConnectionType } from "../connect";

export abstract class Model<T extends Document> {
  constructor(private name: string, private mongo: MongoDbConnectionType) {
    //crea un istanza di client
  }

  private db() {
    if (!this.mongo.client)
      throw new Error(
        "no client instance, call mongoConnection.connect on startup to initialize"
      );
    return this.mongo.client.db();
  }

  protected query() {
    return this.db().collection<T>(this.name);
  }

  async findOne(filter: Filter<Document>) {
    return this.query().findOne(filter);
  }

  async insertOne(document: OptionalUnlessRequiredId<T>) {
    return this.query().insertOne(document);
  }
}
