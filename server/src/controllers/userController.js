const User = require("../models/user");
const { setUser } = require("../service/auth");
const bcrypt = require('bcrypt')

async function handleSignup(req, res, next) {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashedPassword, 
        });
        return res.json("Successfully signed up");
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json("Error during signup");
    }
}


async function handleLogin(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
       
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }
      
        const token = setUser(user);
        
        console.log(token);
        res.json({ token }); // Sending token in JSON format
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Error during login" });
    }
}

async function getUserById(req, res) {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        console.log(user)
        return res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ error: "Error fetching user" });
    }
}


module.exports = { handleSignup, handleLogin, getUserById };
