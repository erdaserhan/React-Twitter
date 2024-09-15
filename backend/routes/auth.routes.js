import express from "express";

const router = express.Router();

router.get('/signup', (req, res) => {
    res.json({
        date: "You hit the signup endpoint",
    });
});



export default router;