const mongoose  = require('mongoose')

const bookSchema = new mongoose.Schema({
    name:{
        type:String,
        requireed:true,
    },
    author:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    pages:{
        type:String,
        required:true,
    },
    price:{
        type:String,
        required:true,
    },
    uid:{
        type:String,
        required:true,
    }

})

const books = mongoose.model('books',bookSchema)

module.exports = books