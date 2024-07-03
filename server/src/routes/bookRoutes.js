const express = require('express');
const router = express.Router();
const { getAllBooks, getBookById, createBook, updateBook, deleteBook, getnumberOfBooks } = require('../controllers/booksController');
const {verifyToken} = require("../service/auth");

router.get('/nob', verifyToken, getnumberOfBooks);
router.get('/:userId?', verifyToken, getAllBooks);
router.get('/bookById/:id', verifyToken, getBookById);
router.post('/', verifyToken, createBook);
router.put('/:id', verifyToken, updateBook);
router.delete('/:id', verifyToken, deleteBook);
module.exports = router;
