const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    prodName: {
        type: String
    },
    prodDesc: {
        type: String
    },
    prodImg: {
        type: String
    },
    prodAmt: {
        type:Number
    },
    prodCategory: {
        type:String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    status: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdOn: {
        type: Date,
        default: new Date()
    },
    updatedOn: {
        type: Date
    }
})

module.exports = mongoose.model("product", productSchema)