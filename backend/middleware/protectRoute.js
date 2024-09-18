import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; // to get jwt, I have created a middleware app.use(cookieParser()) in server.js. So we are able to get the cookies.
        if(!token) {
            res.
        }
    } catch (error) {
        
    }
}