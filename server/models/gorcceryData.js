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
})

const Groccery = new mongoose.model("Customer",groccerySchema)

module.exports = Groccery