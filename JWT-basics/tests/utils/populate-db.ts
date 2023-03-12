//this is only for testing it populates the db with some users:

import { UserSignupType } from "../../models/user.model";
import { dbConnection } from "../../db/connect";
import path from "path";
import dotenv from "dotenv";
import { hashPassword } from "../../utils/hashPassword";
dotenv.config();
const isTesting = process.env.NODE_ENV === "testing";
const testingDb = process.env.DB_PATH_TEST;

const users: UserSignupType[] = [
  {
    email: `email@${Math.random().toString(16).slice(2)}.it`,
    fullname: "marateo mop",
    password: "Secret1",
    username: "marateo1-",
  },
  {
    email: `email@${Math.random().toString(16).slice(2)}.it`,
    fullname: "rateo ton",
    password: "Secret1",
    username: "marateo2",
  },
];

async function fillUsers() {
  if (!isTesting) return;

  try {
    const dbpath = path.resolve(__dirname, "../../", testingDb);
    console.log({dbpath})
    dbConnection.initDB(dbpath);
    const usermodel = dbConnection.createModel<UserSignupType>("user");
    let count = 0;
    for await (let user of users) {
      const hashpass = await hashPassword(user.password);
      await usermodel.insertOne({ ...user, password: hashpass });
      count += 1;
    }

    console.log("inserted count ",count);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

fillUsers();
