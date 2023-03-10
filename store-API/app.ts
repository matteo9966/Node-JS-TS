import express from "express";
import { productrouter } from "./routes/product-route";
const app = express();
app.use(express.json());

app.use("/product", productrouter);

app.listen(5000, () => {
  console.log("listening on port 5000");
});
