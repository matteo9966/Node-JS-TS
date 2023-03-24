import { ObjectId } from "mongodb";

export type TokenSchema = {
   refreshToken:string;
   userAgent:string;
   isValid:boolean;
   user:ObjectId;
   ip:string;
}