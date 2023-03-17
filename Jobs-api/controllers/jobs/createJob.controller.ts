import e from "express";
import { Job } from "../../db/connect";
import { JobTypeInput,jobValidators } from "../../models/jobs.model";
const createJobController = async function (
  req: e.Request,
  res: e.Response,
  next: e.NextFunction
) {
  const job = req.body as JobTypeInput;
  const parsedJob = jobValidators.validateInsertJob(job);
  if (parsedJob.error || !parsedJob?.data) {
    
    res.status(400);
    res.json({
      error: true,
      inserted: false,
      message: parsedJob?.errormessage || "job not inserted",
    });
    return;
  }

  const data = parsedJob.data;

  try {
    await Job.insertOne(data);
    res.status(200);
    res.json({ error: false, inserted: true });
  } catch (error) {
    console.error(error);
    res.status(500)
    res.json({ error: true, inserted: false, message: "job not inserted" });
  }
};


export {createJobController}