const mongoose=require('mongoose')

const newproduct=new mongoose.Schema({
    productname:{type:String,required:true},
    price:{type:Number,required:true},
    description :{type:String,required:true},
    image :{type:String,required:true}
});

const products=mongoose.model('products',newproduct);

module.exports=products;