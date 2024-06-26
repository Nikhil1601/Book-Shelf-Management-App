const { mongoose } = require("mongoose")
const {Schema} = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    },
    status:{
        type:Boolean,
        default:true
    }
    
},
{timestamps:true})

const User = mongoose.model('user',userSchema)

module.exports = User