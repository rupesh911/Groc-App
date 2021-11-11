require("./mongo")
const mongoose = require('mongoose')
const groccerySchema = new mongoose.Schema({
    grocceryItem:{
        type:String,
        required:true,
    },
    isPurchased:{
        type:Boolean,
        required:false
    },
})

const Groccery = new mongoose.model("Customer",groccerySchema)

module.exports = Groccery