import e, { Express } from "express";
import fileupload from "express-fileupload";
import path from "path";
import { uploadRouter } from "../routes/upload.route";
export function configExpressServer(app: Express) {
  app.use(e.json());
  app.use(e.static(path.join(__dirname,'../public')));
  app.use(
    fileupload({
      limits: { fileSize: 50 * 1024 * 1024 },
    })
  );
}
export function configExpressRoutes(app: Express) {
  app.use("/submit", uploadRouter);
}
