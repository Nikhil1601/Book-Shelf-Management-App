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
    active:{
        type:Boolean,
        default:true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },  
},
{timestamps:true})
userSchema.pre('save', function(next) {
    if (!this.username) {
        this.username = this.email.split('@')[0];
    }
    next();
});
const User = mongoose.model('user',userSchema)

module.exports = User