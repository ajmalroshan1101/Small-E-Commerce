const mongoose=require('mongoose')

const newuser=new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    usertype:{
        type:String,
        default:"user"
    }
});

const user=mongoose.model('users',newuser);

module.exports=user;

