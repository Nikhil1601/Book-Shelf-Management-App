const Book = require('../models/books');
const mongoose  = require('mongoose');


async function getAllBooks(req, res) {
    const pageSize = 12;
    const pageString = req.query.page || '1'; 
    let page;
    try {
        page = parseInt(pageString);
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: 'Invalid page number provided'
        });
    }
    const skip = (page - 1) * pageSize;

    try {
        let query = {};
        if (req.user.role === "admin") {
            const userId = req.params.userId;
            if (userId && mongoose.isValidObjectId(userId)) {
                query = { uid: userId };
            } else if (userId) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid user ID provided'
                });
            } else {
                query = {};
            }
        } else {
            query = { uid: req.user._id };
        }
      
        const userBooks = await Book.find(query)
            .skip(skip)
            .limit(pageSize)
            .sort({ _id: -1 });

        res.status(200).json({
            success: true,
            data: userBooks
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
}

   
  async function getnumberOfBooks(req, res) {
    try {
        let count
        if(req.user.role === "admin"){
            count = await Book.countDocuments();
        } else{
            count = await Book.countDocuments({uid: req.user._id})
        }
        res.status(200).json({
            success:true,
            count:count
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
}



async function getBookById(req, res) {
    try {
        const userId = req.user._id;
        const isAdmin = req.user.role === 'admin';
        const query = { _id: req.params.id };
        if (!isAdmin) {
            query.uid = userId;
        }
        const book = await Book.findOne(query);

        if (!book) {
            return res.status(404).json({
                success: false,
                error: "Book not found"
            });
        }
        res.status(200).json({
            success: true,
            data: book
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = { getBookById };


async function createBook(req, res) {
    try {
        req.body.uid = req.user._id;
        const newBook = await Book.create(req.body);
        res.status(200).json({
            success: true,
            data: newBook
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
}

async function updateBook(req, res) {
    try {
        let query = { _id: req.params.id, uid: req.user._id };
        if (req.user.role === 'admin') {
            query = { _id: req.params.id };
        }

        const book = await Book.findOneAndUpdate(query, req.body, { new: true });
        if (!book) {
            return res.status(404).json({
                success: false,
                error: "Book not found"
            });
        }
        res.status(200).json({
            success: true,
            data: book
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
}

async function deleteBook(req, res) {
    try {
        let query = { _id: req.params.id, uid: req.user._id };
        if (req.user.role === 'admin') {
            query = { _id: req.params.id }; 
        }

        const book = await Book.findOneAndDelete(query);
        if (!book) {
            return res.status(404).json({
                success: false,
                error: "Book not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Deleted successfully"
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
}






module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook, getnumberOfBooks };
