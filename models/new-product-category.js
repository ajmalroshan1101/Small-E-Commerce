const mongoose = require('mongoose');

const newcategory = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    }
})

const newcat = mongoose.model('product-categories',newcategory);

module.exports = newcat;