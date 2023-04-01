import { RequestHandler } from "express";
import { handleImageFiles } from "../utils/handle-recieved-files";

export const uploadFileFormController: {
  (...params: Parameters<RequestHandler>): Promise<void>;
} = async function (req, res, next) {
  console.log(req.files);

  if(req.files){
    req.files
  }

  console.log(req.body);
 const result = await handleImageFiles(req);

 res.status(200);
 res.json(result);
};
