import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const protectedRoute = async (req, res, next) => {
    try {
        //1. Get the token from the cookies
        const token = req.cookies.jwt;

        //2. If no token is found, return unauthorized error
        if (!token) {
            return res.status(401).json({ message: "Unauthorized -NoToken Found" });
        }

        //3. Verify the JWT token using the secret key
        const decoded =jwt.verify(token, process.env.JWT_SECRET_KEY);

        //4. If the token is invalid, return unauthorized error
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized -Invalid Token" });
        }

        //5. Find the user by the decoded userId and select all fields except password
        const user = await User.findById(decoded.userId).select("-password");

        //6. If the user is not found, return unauthorized error
        if (!user) {
            return res.status(401).json({ message: "Unauthorized -User Not Found" });
        }

        //7. Attach the user to the request object
        req.user = user;
         
        //8. Call the next middleware
        next();   
    } catch (error) {
        console.log("Error in protectedRoute middleware", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}