// to make the file a module and avoid the TypeScript error
export {}
import { Respone } from "express"
import { userType } from "../Jobs-api/models/user.model"
import { UserType } from "../JWT-basics/models/user.model"
declare global {
  namespace Express {
    export interface Response {
        locals:{ //FIXME: does not work
            jobsUser:UserType
        }
      
    }
  }
}