import { TokenSchema } from "../../schemas/token.schema";
import { MongoDbConnectionType,mongoConnection } from "../connect";
import { Model } from "./Model";

export class TokenModel extends Model<TokenSchema> {
    constructor(name:string,mongo:MongoDbConnectionType){
        super(name,mongo);
    }

}

export const tokenModel = mongoConnection.createModel('tokens',TokenModel);