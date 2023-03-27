import {
  Filter,
  Document,
  OptionalUnlessRequiredId,
  InsertOneOptions,
  UpdateOptions,
  UpdateFilter,
  DeleteOptions,
} from "mongodb";
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

  async insertOne(
    document: OptionalUnlessRequiredId<T>,
    insertOneOptions?: InsertOneOptions
  ) {
    return this.query().insertOne(document, { ...insertOneOptions }); //should update with upsert
  }
  async updateOne(
    filter: Filter<Document>,
    document: Partial<any>,
    updateOneOptions?: UpdateOptions
  ) {
    return this.query().updateOne(filter, document, { ...updateOneOptions });
  }
  async deleteOne(filter: Filter<Document>, deleteOptions?: DeleteOptions) {
    return this.query().deleteOne(filter, { ...deleteOptions });
  }
}
