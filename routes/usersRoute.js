const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/register", async (req, res) => {
    const newuser = new User(req.body);
    
    try {
        const user = await newuser.save();
        res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email: email, password: password });
        if (!user) {
            return res.status(400).json({ message: "Login failed" });
        }
        const temp = {
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            _id: user._id
        };
        return res.status(200).json(temp);
    } catch (error) {
        return res.status(400).json({ error });
    }
});

module.exports = router;