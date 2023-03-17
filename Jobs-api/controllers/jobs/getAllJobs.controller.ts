import { PromisifiedExpressHandler } from "../../types/PromisifiedExpressHandler.type";
import { Job } from "../../db/connect";
import createHttpError from "http-errors";
export const getAllJobs:PromisifiedExpressHandler = async function(req,res,next){
  

    try {
        const jobs = await Job.getAll();

        res.status(200);
        res.json({data:jobs});
        
    } catch (error) {
        console.log(error);
        throw createHttpError.InternalServerError('Sever error')
    }


}