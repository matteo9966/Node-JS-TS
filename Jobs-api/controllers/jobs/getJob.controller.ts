import e from "express";
import { Job } from "../../db/connect";
export const getJobController = async function (
  req: e.Request,
  res: e.Response,
  next: e.NextFunction
) {
  const id = req.params?.id; // mi aspetto il job id da qui
  try {
    const job = await Job.getOne(id);

    if (job.error) {
      res.status(400);
      res.json({ error: true, message: job.message });
    } else {
      res.status(200);
      res.json({ error: false, data: job.data });
    }
  } catch (error) {
    res.status(500);
    res.json({ error: true, message: "internal server error" });
  }
};
