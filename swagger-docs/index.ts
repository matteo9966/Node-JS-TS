import fs from "fs";
import e from "express";
import swaggerUi from "swagger-ui-express";
import path from "path";
const openAPIDocs = fs.readFileSync(path.join(__dirname,'./openapi.json'), { encoding: "utf-8" });
let docs = {
  openapi: "3.0.2",
  info: {
    title: "API Docs",
    version: "1.0",
    description: "these docs are not available",
  },
};
try {
  docs = JSON.parse(openAPIDocs);
} catch (error) {
  console.error("no docs available");
}

const app = e();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(docs));

app.listen(8080, () => console.log("listenign on port 8080"));
