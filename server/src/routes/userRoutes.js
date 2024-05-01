const express = require('express')
const { handleSignup, handleLogin, getUserById } = require('../controllers/userController')
const { verifyToken } = require('../service/auth')

const router = express.Router()

router.post('/',handleSignup)
router.post('/login',handleLogin)
router.get('/',verifyToken,getUserById)

module.exports = router