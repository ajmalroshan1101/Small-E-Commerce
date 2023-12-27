const bcrypt = require("bcrypt");

const User = require("../models/usersdata");
// const user = require("../models/usersdata");

let object = {
  signuprouter: (req, res) => {
    // res.render("signup");
    if(req.session.userId){
      res.redirect('/home')
    }else{
      res.render("signup")
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
        res.status(409).redirect("/");
      } else {
        // hash the password before storing to the database
        const hashedpass = await bcrypt.hash(password, 10);

        //Here we insert the data of user In Newuser with User that is already the schema is set
        const newuser = new User({ username, email, password: hashedpass });

        // Here we Save the in the database with the .save() this will store data in the database
        const savedata = await newuser.save();

        req.session.userId = savedata._id;

        res.redirect("/home");
      }
    } catch {

    }
  },
  homepage: (req, res) => {
    if(req.session.userId){
      res.render("home")
    }else{
      res.redirect('/login')
    }
  },
  loginpage:(req,res)=>{
 if(req.session.userId){
      res.render("home")
    }else{
      res.render("login")
    } 
   },
   loginpost:async (req,res)=>{
    try{

      const {username,password}=req.body;

      console.log(username,password);
      
      const user= await User.findOne({username})

      console.log(user);

      if(!user){
            return res.status(401).json({ message: 'Invalid username or password' });
      }
      
      const passwordmatch=await bcrypt.compare(password,user.password)

      console.log(passwordmatch);

      if(!passwordmatch){
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      req.session.userId=user._id;
      
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
        const userprofile=await User.findOne({_id:req.session.userId})
        console.log(userprofile);
        res.render('profile',{userprofile})
      }
    }catch(err){
      console.error('Error user not found:', err);
    }
 
  }
};

module.exports = object;
