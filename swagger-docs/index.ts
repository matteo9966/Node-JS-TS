import fs from "fs";
import e from "express";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { addUsercontroller, getUserController } from "./users.controller";
const openAPIDocs = fs.readFileSync(path.join(__dirname, "./userdocs.json"), {
  encoding: "utf-8",
});


let docs;

try {
  docs = JSON.parse(openAPIDocs);
} catch (error) {
  console.error("no docs available");
}

const app = e();
app.use(e.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(docs));

//the only two routes for the docs:
app.get("/user/:id", getUserController);
app.post("/user", addUsercontroller);

function main() {
  try {
    app.listen(6600, () => {
      console.log("listenign on port 6600");
    });
  } catch (error) {
    console.log(error);
  }
}
main();

//lets create a basic server that accepts a get and a post request
