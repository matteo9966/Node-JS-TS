import { PasswordToken } from "../../schemas/passwordToken.schema";
import { TokenSchema } from "../../schemas/token.schema";
import { MongoDbConnectionType, mongoConnection } from "../connect";
import { Model } from "./Model";

/**
 * @description the passwordToken is used to store the password tokens for the users that want to reset their passwords, the tokens have a validity of 10 minutes (600s)
 */
export class PasswordTokenModel extends Model<PasswordToken> {
  constructor(name: string, mongo: MongoDbConnectionType) {
    super(name, mongo);
  }
}

//TODO: Start from here! 
export const passwordToken = mongoConnection.createModel<PasswordTokenModel>(
  "passwordToken",
  PasswordTokenModel
);
