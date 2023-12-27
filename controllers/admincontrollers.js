const bcrypt = require("bcrypt");

const User = require("../models/usersdata");

const Product=require('../models/product');
const products = require("../models/product");

const obj={
AdminHome:(req,res)=>{

    try{
        if(req.session.userId&&req.session.Isadmin){
            res.render("AdminHome")
    
        }else{
            console.log("hihfedp world");
            res.redirect('/login')
        }
    
    }catch(err){

    }
  
},
ADlogout:(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
          res.status(500).send('destory is not working')
        }else{
          res.redirect('/login')
        }
      }) 
},
// userlist:(req,res)=>{
//     try{
//         if(req.session.userId&&req.session.Isadmin){
//             res.render("userlist")
    
//         }else{
//             console.log("hihfedp world");
//             res.redirect('/login')
//         }
    
//     }catch(err){

//     }
// }
userlist: async (req, res) => {
    try {
      if (req.session.userId && req.session.Isadmin) {
        // Fetch user details from the database
        const users = await User.find({});

        // Render the 'userlist' view and pass the user details
        res.render('userlist', { users });
      } else {
        console.log('Unauthorized access');
        res.redirect('/login');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).send('Internal Server Error');
    }
  },
  deleteuserid:async(req,res)=>{
    try{



       const userId = req.params.userId;

       const user = await User.findById(userId)

       if(user.usertype==='admin'){

        console.log('Admin user cannot be deleted:', userId);
        res.status(403).json({ message: 'Admin user cannot be deleted' });

       }else{
           
           const result= await User.findByIdAndDelete(userId);
           console.log('Deletion result:', result);
   
           res.redirect('/AdminHome/userlist');
       }
    }catch(err){
        console.error('Error deleting user:', err);
    }
  },
  productHome:(req,res)=>{
    if (req.session.userId && req.session.Isadmin) {
        res.render('products');
      }else{
        res.redirect('/AdminHome')
      }

  },
  addproduct:(req,res)=>{
    if (req.session.userId && req.session.Isadmin) {
      res.render('AddProduct');
    }else{
      res.redirect('/AdminHome')
    }
  },
  ADDproduct:async (req,res)=>{
    const {productName,productPrice,productDescription}=req.body;
    console.log({productName,productPrice,productDescription});
    const imageurl=req.file ? `/uploads/${req.file.filename}`:'/default-image.jpg';
    console.log(imageurl);

    const newproduct=new Product({
     productname:productName,
     price:productPrice,
     description:productDescription,
     image:imageurl
    })
     
    try{
      const savedaproduct=await newproduct.save();
      res.redirect('/AdminHome/Productlist')
    }catch(err){
      console.error('Error deleting user:', err);

    }

  },
  showproductlist:async (req,res)=>{
    try{
      if (req.session.userId && req.session.Isadmin) {
      const products= await Product.find({});

        res.render('Productlist',{ products});
  
      }else{
        res.redirect('/AdminHome')
      }
    }catch(err){
      console.error('Error deleting user:', err);
    }
   
  },

  deleteproduct:async(req,res)=>{

    const productId=req.params.productId;
    try{
      await products.findByIdAndDelete(productId)
      res.redirect('/AdminHome/Productlist')
    }
    catch(err){

      console.error('Error deleting user:', err);
    }
  },
  showupdateproduct:async (req,res)=>{
    try{
      if (req.session.userId && req.session.Isadmin) {

        const updateid=req.params.productId;

      const product= await Product.findById(updateid);

        res.render('updateform',{ product});
  
      }else{
        res.redirect('/AdminHome')
      }
    }catch(err){

      console.error('Error deleting user:', err);
    }
  },
  Updateproduct:async(req,res)=>{
    const useridup=req.params.productId;

    const product= await Product.findById(useridup);

    if(!product){
      return res.status(404).send("product not found")
    }

    product.productname=req.body.name;
    product.price=req.body.price;
    product.description=req.body.description;

    if(req.file){
      product.image=`/uploads/${req.file.filename}`
    }
     await product.save();

    res.redirect('/AdminHome/Productlist')
  }
}



module.exports=obj;
