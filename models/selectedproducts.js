const mongoose = require("mongoose");

const products = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  febric: {
    type: String,
  
  },
  img:{
    type:String,
 
  },
  mrp:{
    type:Number,
    required:true
  },
  productid:{
    type:mongoose.Types.ObjectId,
    required:true
  },
  size:{

    type: String
  },
  stock:{
    type:Number
  }
});

const newproduct = mongoose.model('cateproduct',products);

module.exports = newproduct;
