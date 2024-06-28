const express = require('express')
const { handleSignup, handleLogin, getUserById, getUsers, updateUserStatus, getnumberofUsers } = require('../controllers/userController')
const { verifyToken } = require('../service/auth')

const router = express.Router()

router.get('/nou',verifyToken,getnumberofUsers)
router.post('/',handleSignup)
router.post('/login',handleLogin)
router.get('/allusers',verifyToken,getUsers)
router.put('/updateStatus',verifyToken,updateUserStatus)
router.get('/',verifyToken,getUserById)

module.exports = router