import e from "express";
import httperrors from "http-errors";
import _ from "lodash";
import { Job } from "../../db/connect";
import {
  CreatedJob,
  JobTypeInput,
  updatableProps,
} from "../../models/jobs.model";
const updateJob = async function (
  req: e.Request,
  res: e.Response,
  next: e.NextFunction
) {

    //lets say only manager and admin can create and update jobs for now
  const job = req.body as Partial<JobTypeInput>;
  if (!job.id) {
    throw httperrors.BadRequest("job is missing id property");
  }

  //TODO check if the user id is the owner or is admin


  const updateObj = _.pick(
    _.omitBy(job, (j) => {
      return _.isUndefined(j) || _.isNull(j);
    }),
    updatableProps
  );

  try {
    //should make a call and check if user is the creator of the job
   const update  =  await Job.update(updateObj as CreatedJob);
   if(update===null){
    throw new Error('not updated')
   }
   console.log(update)
    res.json({ updated: true, updateCount: Object.keys(updateObj).filter(k=>k!=='id').length });
  } catch (error) {
    res.json({ updated: false, updateCount: 0,});
  }
};

export { updateJob };
