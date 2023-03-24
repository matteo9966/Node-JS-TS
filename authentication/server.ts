import dotenv from "dotenv";
import e from "express";
import { configServerRouter } from "./configrouter";
import { mongoConnection } from "./mongodb/connect";
import cookieParser from 'cookie-parser'
dotenv.config();
const port = process.env.AUTHENTICATION_APP_PORT;
const app = e();
app.use(e.json())
app.use(cookieParser());

configServerRouter(app); 
//now i must create the db connection

async function main() {
  try {
    await mongoConnection.connect();
    app.listen(port,()=>console.log(`listening on ${port}`));
  } catch (error) {
    console.dir(error);
    process.exit(1);
  }
}

main();

export {app}