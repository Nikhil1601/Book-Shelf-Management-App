const User = require("../models/user");
const Book = require("../models/books")
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
       if(user.active === false){
        return res.status(403).json({error:"Account disabled"});
       }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }
      
        const token = setUser(user);
        role = user.role
        console.log(token);
        res.json({ token ,role});
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
                    
                },
                { $match: 
                    { role: 
                        { $ne: 'admin' 

                        } 
                    } 
                },
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


async function updateUserStatus(req,res){
    const userId=req.params.id;
    try{
        if(req.user.role === "admin"){
            const user = await User.findById(userId);
            if(!user){
                return res.status(404).json({ error: "User not found" });
            }
            user.active = !user.active
            await user.save();
            return res.json({message:"User updated sucessfully"});
        }else{
            return res.status(403).json({message:"Unauthorized access"});
        }
        
    }catch(err){
        console.error("Error updating status of the user",err);
        return res.status(500).json({message:"Error updating user"});
    }

  }




async function getnumberofUsers(req,res,next){
    let count;
    try{
    if(req.user.role === "admin"){
        count = await User.countDocuments()
    }
    res.status(200).json({
        success:true,
        ucount:count
    })
}catch (err) {
    res.status(400).json({
        success: false,
        error: err.message
    });
}
}

async function getUserIdwithName(req, res, next) {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized Access'
            });
        }

        const users = await User.aggregate([
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: 'uid',
                    as: 'books'
                }
            },
            {
                $project: {
                    username: 1,
                    _id: 1,
                    numberOfBooks: { $size: '$books' },
                    name:1
                }
            }
        ]);

        res.json({
            success: true,
            data: users
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
}



async function deleteUser(){
    
}


// async function updateExistingUsers() {
//     try {
//         const users = await User.find({});
        
//         for (let user of users) {
//             if (!user.username) {
//                 user.username = user.email.split('@')[0];
//                 await user.save();
//                 console.log(`Updated username for user ${user.name}`);
//             }
//         }

//         console.log('All users updated successfully');
//     } catch (err) {
//         console.error('Error updating users:', err);
//     }
// }
// updateExistingUsers()

module.exports = { handleSignup, handleLogin, getUserById,getUsers, updateUserStatus, getnumberofUsers,getUserIdwithName };
