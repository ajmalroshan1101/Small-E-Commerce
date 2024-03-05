const bcrypt = require("bcrypt");

const User = require("../models/usersdata");

const Profile =require("../models/address");

const Product=require('../models/product');

const newproduct = require('../models/selectedproducts');


const newproductcategory = require('../models/new-product-category');

// const user = require("../models/usersdata");

let object = {
  signuprouter: (req, res) => {

    // res.render("signup");

    if(!req.session.userId){

      res.render("signup",{message:req?.session?.message})//Here the message is sent to user while a error password occar
      
    }else if(!req.session.Isadmin){
      
      res.redirect('/home')
      

    }else {
      res.redirect('/AdminHome')
    }
  },
  postsignup: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      console.log(username, email, password);

      const existingUser = await User.find({ $or: [{ username }, { email }] });


    //   existingUser is giving empty value so .length will show if there is value or not
      if (existingUser.length!=0) {

        console.log('useralready exist');

        req.session.message="Alredy Exist User"

        res.status(409).redirect("/");

      } else {
        // hash the password before storing to the database
        const hashedpass = await bcrypt.hash(password, 10);

        //Here we insert the data of user In Newuser with User that is already the schema is set
        const newuser = new User({ username, email, password: hashedpass });

        // Here we Save the in the database with the .save() this will store data in the database
        const savedata = await newuser.save();

        req.session.userId = savedata._id;

        req.session.message=""

        res.redirect("/home");
      }
    } catch {

    }
  },
  homepage:async (req, res) => {
    if(req.session.userId){

      const products=await newproductcategory.aggregate([
        {
          $lookup: {
            from: 'cateproducts',
            localField: '_id',
            foreignField: 'productid',
            as: 'products'
          }
        },
        {
          $addFields: {
            products: { $slice: ['$products', 1] } // Limit the 'products' array to 1 element
          }
        }
      ])
      console.log(products)
      const allproduct = await newproduct.find({});
      
      res.render("home",{products})

    }else{
      res.redirect('/login')
    }
  },
  loginpage:(req,res)=>{

    if(!req.session.userId){

  
      res.render("login",{message:req?.session?.message})
      
    }else if(!req.session.Isadmin){
      
      res.redirect("/home")
    } else{
      res.redirect('/AdminHome')
    }
   },

   loginpost:async (req,res)=>{
    try{

      const {username,password}=req.body;

      console.log(username,password);
      
      // fatching data from the collection using the username 
      const user= await User.findOne({username})

      console.log(user);

      if(!user){
            return res.status(401).json({ message: 'Invalid username' });
      }

      //Here comparing the normal password with hased password which is already in the database
      const passwordmatch=await bcrypt.compare(password,user.password);

      if(!passwordmatch){

       
        req.session.message="Invalid Password Try Agian";

        res.redirect('/login');
      }

      
     
      //Adding session to the already user while logedin 
      req.session.userId=user._id;
      
      //Here if the usertype is admin then isadmin will be true and render the admin page.
      // if the userType is user the it will render the home page
      if(user.usertype==='admin'){
        req.session.Isadmin=true;
        res.redirect('/AdminHome')
        
      }else{

        req.session.Isadmin=false;

        res.redirect('/home')
      }
       
    }catch{

    }
   },    
  logout:(req,res)=>{
    // Here session is deleting 
    req.session.destroy((err)=>{
      if(err){
        res.status(500).send('destory is not working')
      }else{
        res.redirect('/login')
      }
    })
  },
  profile:async(req,res)=>{
    try{

      if(req.session.userId){


        //here we are finding and fatching data using session .
        // this for getting the userId form the database 
        const user=await 
        User.findOne
        ({_id:req.session.userId})
      
       //Here the data is take from another collection using $looku. profile is the another collection 
       //from where take data and data will store in userprofile(always check the spelling)
        const userfindresult= await 
        User.aggregate([
          {$match:{_id:user._id}},
          {
            $lookup:{
              from:'profiles',
              localField:'_id',
              foreignField:'userId',
              as:'userProfile'
            }
          }
        ]);

        console.log(userfindresult);

        //Here data(user,userfindresult(both are collection data)) is sent to the ejs file 
        res.render('profile',
        {user,userfindresult})

      }else{
        res.redirect
        ('/login')
      }
    }catch(err){
      console.error
      ('Error user not found:', err);
    }
 
  },
  Editprofile:async(req,res)=>{

    if(req.session.userId){

      //here we are finding and fatching data usi<<ng session .this for getting the userId form the database 
       const user=await 
       User.findOne
       ({_id:req.session.userId})

             //Here the data is take from another collection using $looku. profile is the another collection 
       //from where take data and data will store in userprofile(always check the spelling)
       const userfindresult= await 
       User.aggregate([
        {$match:{_id:user._id}},
        {
          $lookup:{
            from:'profiles',
            localField:'_id',
            foreignField:'userId',
            as:'userProfile'
          }
        }
      
      ]);

       //Here the data is send to the ejs file
       res.render
       ('Editprofile',
       {user,userfindresult})

    }else{
      res.redirect
      ('/login')
    }
  
  },
  postEditeprofile:async (req,res)=>{
   
    //here we are finding and fatching data using session .this for getting the userId form the database 
    const user=await 
    User.findOne
    ({_id:req.session.userId});

    console.log('---------user--------------')
    console.log(user);
 
    // Here session is added while loggedin using user._id
    const userId=user._id;

  
    const {username,
           email,
           address,
           phone,
           state}
           =req.body;

  // this is to send new data to the profile collection but in this situation this methoad is not needed
  //   const newprofile=new Profile({
  //     userId:new mongoose.Types.ObjectId(user._id),
  //     address:address,
  //     phone:phone,
  //     state:state
  //   })

  //  await newprofile.save();

  await User.updateOne(
    {_id:req.session.userId},
    {$set:{username,email}}
    )

  //here if the there is no data in the profile collection this method will increat data to the collection 
  //if there is data in the collection Update the data with new entered data 
  await 
  Profile.updateOne({userId},
    {$set:{userId,address,phone,state}},
    {upsert:true});

    res.redirect('/User/profile')
  },
  viewproduct:async(req,res)=>{

    if(req.session.userId){

      // Here we take the value (productaId from request along with value attched with request while sending)
      // Here the value is take by using req.params.productId 
      const proid=req.params.productId;
      
      // Here we find the product using the proid or productId get from the request
      const finduser=await newproductcategory.findOne({_id:proid});

      const findproductWithCategory = await newproductcategory.aggregate([
        {
            $match: { _id: finduser._id }
        },
        {
            $lookup: {
                from: 'cateproducts',
                localField: '_id',
                foreignField: 'productid',
                as: 'categoryProducts'
            }
        }
    ]);

   
      res.render('userviewproduct', {proid});
    }

  }
};

module.exports = object;
