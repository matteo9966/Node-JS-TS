import type { ErrorRequestHandler } from "express";
import httperrors from 'http-errors'
export const errorHandlerMiddleware :ErrorRequestHandler=(err,req,res,next)=>{
    if(httperrors.isHttpError(err)){
        res.status(err.statusCode);
        res.json({error:true,message:err.message})
    }else{
        next(err) //if not instance of httpError
    }
}