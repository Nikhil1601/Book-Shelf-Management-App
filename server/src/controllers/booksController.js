const Book = require('../models/books');



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
      const userBooks = await Book.find({ uid: req.user._id })
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
        const count = await Book.countDocuments({ uid: req.user._id });
        res.status(200).json({
            success: true,
            count: count
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
}

async function getBookById(req, res) {
    try {
        const book = await Book.findOne({ _id: req.params.id, uid: req.user._id });
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
        const book = await Book.findOneAndUpdate({ _id: req.params.id, uid: req.user._id }, req.body, { new: true });
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
        const book = await Book.findOneAndDelete({ _id: req.params.id, uid: req.user._id });
        if (!book) {
            return res.status(404).json({
                success: false,
                error: "Book not found"
            });
        }console.log('deleted');
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
