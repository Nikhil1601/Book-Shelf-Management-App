const express = require('express');
const router = express.Router();
const { getAllBooks, getBookById, createBook, updateBook, deleteBook, getnumberOfBooks } = require('../controllers/booksController');
const {verifyToken} = require("../service/auth");

router.get('/', verifyToken, getAllBooks);
router.get('/nob', verifyToken, getnumberOfBooks);
router.get('/:id', verifyToken, getBookById);
router.post('/', verifyToken, createBook);
router.put('/:id', verifyToken, updateBook);
router.delete('/:id', verifyToken, deleteBook);

module.exports = router;
