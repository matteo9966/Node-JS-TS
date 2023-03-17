import { JsonDB, Config, DataError } from "node-json-db";
import _ from "lodash";
import path from "path";
import { userType } from "../models/user.model";
import { JobTypeInput } from "../models/jobs.model";

//immagina di avere un oggetto

class DBConnection {
  db: JsonDB | undefined;
  constructor(private dbname: string) {}

  /**
   *
   * @param dbname the path to the dbfolder
   */
  public initDB(dbname: string) {
    try {
      const config = new Config(dbname, true, false, "/");
      this.db = new JsonDB(config);
    } catch (error) {
      throw new Error("unable to initialize database");
    }
  }

  createModel<T extends { id?: string }>(path: string) {
    return new Model<T>(path, this);
    //questo crea un model con cui posso interagire con il db
  }
}

export class Model<T extends { id?: string }> {
  constructor(private path: string, private dbconnection: DBConnection) {
    //the path is what i use to create the piece in the db
  }

  async insertOne(item: T) {
    //todo: trasforma tutte le proprietà aggiungendo un decorator alla classe
    if (!this.dbconnection.db) {
      throw new Error(
        "call initDB on dbConnection instance when creating the db"
      );
    }

    if (!item.id) {
      item.id = Math.random().toString(32).slice(2);
    }
    await this.dbconnection.db.push(
      "/".concat([this.path, item.id].join("/")),
      item
    );
  }

  async getOne(
    id: string
  ): Promise<{ data?: T; error: boolean; message?: string }> {
    if (!this.dbconnection.db) {
      throw new Error(
        "call initDB on dbConnection instance when creating the db"
      );
    }

    try {
      const data = (await this.dbconnection.db.getData(
        "/".concat([this.path, id].join("/"))
      )) as T;

      return { data, error: false };
    } catch (err) {
      if (
        err instanceof DataError &&
        err.message &&
        err.message.includes("Stopped at")
      ) {
        return { error: true, message: "no item with id provided" };
      }
      return { error: true, message: "db error" };
    }
  }

  async getAll(): Promise<T[]> {
    if (!this.dbconnection.db) {
      throw new Error(
        "call initDB on dbConnection instance when creating the db"
      );
    }
    const tasks = await this.dbconnection.db.getData("/" + this.path);
    return _.values(tasks) || [];
  }

  async deleteOne(id: string): Promise<{ deleted: boolean; message?: string }> {
    if (!this.dbconnection.db) {
      throw new Error(
        "call initDB on dbConnection instance when creating the db"
      );
    }

    try {
      await this.dbconnection.db.delete("/".concat([this.path, id].join("/")));
      return { deleted: true };
    } catch (error) {
      if (error instanceof DataError && error.message.includes("Stopped at")) {
        return { deleted: false, message: "no element with id" };
      }

      return { deleted: false, message: "error while deleting" };
    }
  }

  async update(obj: T) {
    if (!this.dbconnection.db) {
      throw new Error(
        "call initDB on dbConnection instance when creating the db"
      );
    }
    const id = obj.id;
    //cerchiamo questo obj e
    if (!id) {
      return null;
    }
    try {
      const task = await this.getOne(id);
      if (task.error || !task.data) throw new Error("no task");

      const taskcopy = JSON.parse(JSON.stringify(task));
      for (let key in task.data) {
        if (key in obj && key !== "id") {

          task.data[key] = obj[key];
        }
      }
      await this.insertOne(task.data);
      return {
        old: taskcopy,
        new: task,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //TODO: fix this find method let it return a valid type not any
  async find<T>(cb: (input: T) => boolean): Promise<T | null> {
    if (!this.dbconnection.db) {
      throw new Error(
        "call initDB on dbConnection instance when creating the db"
      );
    }
    try {
      let result = [];
      const data = await this.dbconnection.db.getData("/" + this.path);
      if (typeof data === "object") {
        result = _.values(data);
      }

      let objResult: T | null = result.find(cb) || null;
      return objResult;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findAll<T>(cb: (input: T) => boolean) {
    if (!this.dbconnection.db) {
      throw new Error(
        "call initDB on dbConnection instance when creating the db"
      );
    }
    try {
      let result = [];
      const data = await this.dbconnection.db.getData("/" + this.path);
      if (typeof data === "object") {
        result = _.values(data);
      }

      let objResult: T[] = result.filter(cb);
      return objResult;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

const dbpath = path.join(__dirname, "./product-db");

export const dbConnection = new DBConnection(dbpath); // questa funzione deve essere chiamata nel main

export const User = dbConnection.createModel<userType>("user");

export const Job = dbConnection.createModel<JobTypeInput>("job");

// export const Product = dbConnection.createModel<ProductType>("product");

//posso aggiungere un decorator alla classe che decora ogni metodo aggiungendo il validator di zod
