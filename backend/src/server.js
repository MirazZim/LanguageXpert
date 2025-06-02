import express from "express";
import "dotenv/config";
import authRoutes from "../src/routes/auth.route.js";
import { connectDB } from "./lib/db.js";

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    connectDB();
});