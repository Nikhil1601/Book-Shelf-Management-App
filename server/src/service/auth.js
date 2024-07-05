const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const secret = process.env.SECRET;

function setUser(user) {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        role: user.role
    }, secret);
}



async function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) return res.status(401).json({ message: 'No token provided' });

    await jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            console.error('Error verifying token:', err.message);
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.user = decoded;
        next();
    });
}




module.exports = { setUser,verifyToken };
