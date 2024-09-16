import User from "../models/user.model.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;   //Regular Expression
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already exists" });
        }
    }catch(error) {

    }
}

export const login = async (req, res) => {
    res.json({
        date: "You hit the login endpoint",
    });
}

export const logout = async (req, res) => {
    res.json({
        date: "You hit the logout endpoint",
    });
}