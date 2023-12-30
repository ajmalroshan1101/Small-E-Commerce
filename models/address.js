const mongoose=require('mongoose');

const newaddress=new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    address:{type:String},
    phone:{type:Number},
    state:{type:String}
})

const address=mongoose.model('profiles',newaddress);

module.exports=address;