const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
    },
    mobile:{
        type:Number,
        unique:true
    },
    token:{
        type:String
    },
    status:{
        type:Boolean,
        default:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    createdOn:{
        type:Date,
        default:new Date()
    },
    updatedOn:{
        type:Date,
    },
});

module.exports = mongoose.model("user",userSchema);