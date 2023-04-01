import e from "express";
import { configExpressRoutes, configExpressServer } from "./utils/config";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.FILE_UPLOAD_PORT;
const app = e();
configExpressServer(app); //all middleware is added here
configExpressRoutes(app);

function main() {
  try {
    app.listen(port, () => {
      console.log("listening on port ::: ", port);
    });
  } catch (error) {
    console.log(error);
  }
}
main();
