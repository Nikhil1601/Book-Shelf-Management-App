const express = require('express')
const { handleSignup, handleLogin, getUserById, getUsers } = require('../controllers/userController')
const { verifyToken } = require('../service/auth')

const router = express.Router()

router.post('/',handleSignup)
router.post('/login',handleLogin)
router.get('/allusers',verifyToken,getUsers)
router.get('/',verifyToken,getUserById)

module.exports = router