import { UserSignupType } from "../../schemas/user.schema";
import { MongoDbConnectionType,mongoConnection } from "../connect";
import {Model} from './Model';

export class UserModel extends Model<UserSignupType> {
    constructor(name:string,mongo:MongoDbConnectionType){
      super(name,mongo);
    }
  
   
    //inside here i can put all the methods i want to query the model
  
  }

  const userModel = mongoConnection.createModel<UserModel>('users',UserModel);

  export {userModel}

