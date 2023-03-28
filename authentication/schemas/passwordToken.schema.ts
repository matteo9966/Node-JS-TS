import { ObjectId } from "mongodb";

export type PasswordToken = {
   token:string;
   tokenExpiration:Date;
   user:ObjectId;
}