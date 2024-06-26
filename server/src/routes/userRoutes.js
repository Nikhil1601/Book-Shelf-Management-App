const express = require('express')
const { handleSignup, handleLogin, getUserById, getUsers, updateUserStatus } = require('../controllers/userController')
const { verifyToken } = require('../service/auth')

const router = express.Router()

router.post('/',handleSignup)
router.post('/login',handleLogin)
router.get('/allusers',verifyToken,getUsers)
router.get('/updateStatus',verifyToken,updateUserStatus)
router.get('/',verifyToken,getUserById)

module.exports = router