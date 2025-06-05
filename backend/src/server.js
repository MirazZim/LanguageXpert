import express from "express";
import "dotenv/config";
import authRoutes from "../src/routes/auth.route.js";
import userRoutes from "../src/routes/user.route.js";
import chatRoutes from "../src/routes/chat.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    connectDB();
});