import { JsonDB, Config } from "node-json-db";
import _ from "lodash";
import path from "path";
import { ProductType } from "../models/product.model";

//immagina di avere un oggetto

class DBConnection {
  db: JsonDB;
  constructor(private dbname: string) {
    this.db = this.initDB();
  }

  private initDB() {
    const config = new Config(this.dbname, true, false, "/");
    return new JsonDB(config);
  }

  createModel<T extends { id?: string }>(path: string) {
    return new Model<T>(this.db, path);
    //questo crea un model con cui posso interagire con il db
  }
}

export class Model<T extends { id?: string }> {
  constructor(private db: JsonDB, private path: string) {
    //the path is what i use to create the piece in the db
  }

  async insertOne(item: T) {
    if (!item.id) {
      item.id = Math.random().toString(32).slice(2);
    }
    await this.db.push("/".concat([this.path, item.id].join("/")), item);
  }

  async getOne(id: string): Promise<T | null> {
    let result = null;
    try {
      result = (await this.db.getData(
        "/".concat([this.path, id].join("/"))
      )) as T;
    } catch (err) {
      console.error(err);
    }
    return result;
  }

  async getAll():Promise<T[]> {
    const tasks = await this.db.getData("/" + this.path);
    return _.values(tasks) || [];
  }

  async deleteOne(id: string) {
    let deleted = false;
    try {
      await this.db.delete("/".concat([this.path, id].join("/")));
      deleted = true;
    } catch (error) {
      deleted = false;
    }
    return deleted;
  }

  async update(obj: T) {
    const id = obj.id;
    //cerchiamo questo obj e
    if (!id) {
      return null;
    }
    try {
      const task = await this.getOne(id);
      if (!task) throw new Error("no task");
      const taskcopy = structuredClone(task);
      for (let key in task) {
        if (key in obj && key !== "id") {
          task[key] = obj[key];
        }
      }
      await this.insertOne(task);
      return {
        old: taskcopy,
        new: task,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async find<T>(cb: (input: T) => boolean) {
    try {
      let result = [];
      const data = await this.db.getData("/" + this.path);
      if (typeof data === "object") {
        result = _.values(data);
      }

      let objResult = result.find(cb) || null;
      return objResult;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findAll<T>(cb: (input: T) => boolean) {
    try {
      let result = [];
      const data = await this.db.getData("/" + this.path);
      if (typeof data === "object") {
        result = _.values(data);
      }

      let objResult:T[] = result.filter(cb);
      return objResult;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

const dbpath = path.join(__dirname, "./product-db");

export const dbConnection = new DBConnection(dbpath);

export const Product = dbConnection.createModel<ProductType>("product");

//posso aggiungere un decorator alla classe che decora ogni metodo aggiungendo il validator di zod
