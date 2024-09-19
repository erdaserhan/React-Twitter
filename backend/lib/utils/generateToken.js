import jwt from 'jsonwebtoken';

//JWT_SECRET to create a secret key on bash = openssl rand -base64 32
export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d'
    })
//we have created a token (jwt.sign), added the userId as a payload, so we can check which user have this token.
//Have encoded with process.env.JWT_SECRET. this will gonna expire in 15 days


//We added extra security options and send it as a cookie to the user
    res.cookie("jwt", token, {
        maxAge: 15*24*60*60*1000, //MS
        httpOnly: true, //prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", //CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development",
    });
};