require("./mongo")
const mongoose = require('mongoose')
const groccerySchema = new mongoose.Schema({
    grocceryItem:{
        type:String,
        required:true,
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    isPurchased:{
        type:Boolean,
        required:false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
})

const Groccery = new mongoose.model("Customer",groccerySchema)

module.exports = Groccery