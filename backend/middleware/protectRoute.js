import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; //We get the token from the cookies. To get jwt, I have created a middleware app.use(cookieParser()) in server.js. So we are able to get the cookies.
        if(!token) {
            return res.status(401).json({ error: "Unauthorized: No Token Provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); //We verify this token with JWT_SECRET that we created previously

        if(!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid Token"});
        }

        const user = await User.findById(decoded.userId).select("-password"); //UserId= payload in this token. We don't want to return the password so .select("-password"). We user userId to find User in our database.

        if(!user) {
            return res.status(404).json({ error: "User not found"});
        }

        req.user = user;
        next(); //calls the next function which is getMe in auth.routes.js
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};