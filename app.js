import express from "express";
import cors from "cors";
import { arouter } from "./routes/authRoutes.js";
import { dbConnect } from "./db/dbConnect.js";
import dotenv from "dotenv";
import { prouter } from "./routes/productRoutes.js";
import { crouter } from "./routes/categoryRoutes.js";
import path from "path";

const app = express();
dbConnect();

dotenv.config();
const port = process.env.PORT || 8000;
app.use(cors());
// app.use(express.urlencoded());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./frontend/build")));

app.use("/api/v1/user", arouter);
app.use("/api/v1/product", prouter);
app.use("/api/v1/category", crouter);
app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
});

app.listen(port, () => {
  console.log(`app lisetn on the port ${port}`);
});