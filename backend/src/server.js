import express from "express";
import "dotenv/config";
import authRoutes from "../src/routes/auth.route.js";

const app = express();
const port = process.env.PORT 

app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});