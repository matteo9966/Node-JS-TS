//deletes a job by id and returns true o false

import e from "express";
import { Job } from "../../db/connect";
export const deleteJobController = async function (
  req: e.Request,
  res: e.Response,
  next: e.NextFunction
) {
  const id = req.params?.id; // mi aspetto il job id da qui

  try {
    const deleted = await Job.deleteOne(id);
    if (deleted.deleted) {
      res.json({ deleted: true, error: false });
      res.status(200);
    } else {
      res.status(201);
      res.json({
        deleted: false,
        error: true,
        message: deleted.message || "error while deleting",
      });
    }
  } catch (error) {
    res.json({ deleted: false, error: true, message: "server error" });
    res.status(500);
  }
};
