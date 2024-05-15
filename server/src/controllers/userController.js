const User = require("../models/user");
const Book = require("../models/books")
const { setUser } = require("../service/auth");
const bcrypt = require('bcrypt')

async function handleSignup(req, res, next) {
    const { name, email, password,role } = req.body;
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
            role,
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
        role = user.role
        console.log(token);
        res.json({ token ,role}); // Sending token in JSON format
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


async function getUsers(req, res) {
    try {
        if (req.user.role === "admin") {
            const usersWithBookCount = await User.aggregate([
                {
                    $lookup: {
                        from: "books",
                        localField: "_id",
                        foreignField: "uid",
                        as: "books"
                    }
                },
                {
                    $addFields: {
                        bookCount: { $size: "$books" }
                    }
                },
                {
                    $project: {
                        password: 0,
                        books: 0 
                    }
                }
            ]);

            res.status(200).json({
                success: true,
                data: usersWithBookCount
            });
        } else {
            return res.status(403).json({ error: "Unauthorized access" });
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Error fetching users" });
    }
}


module.exports = { handleSignup, handleLogin, getUserById,getUsers };
