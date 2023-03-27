import e from "express"
import { APIResponse } from "../../interfaces/response.interface";
import { tokenModel } from "../../mongodb/models/Token.model";
export const logoutController:e.RequestHandler = async function (req,res,next){
    //if logged in, find the refresh token and remove both refresh an and session token
    const {refreshtoken} = req.cookies;
    const responsebody:APIResponse<any> = { error:false}
    try {
      const deleteResult =   await tokenModel.deleteOne({refreshToken:refreshtoken})
      console.log(deleteResult)
    } catch (error) {
        console.log('error while trying to delete the refresh token:',error);
    }
    clearAllCookies(req,res);
    //find the refreshtoken
    responsebody.statusCode=200;
    res.status(200);
    res.json(responsebody)
}


function clearAllCookies(req:e.Request,res:e.Response){
    const cookies = req.cookies || {};
    for(let key in cookies){
        res.cookie(key,'',{httpOnly:true,expires:new Date()})
    }
}