const express=require('express')
const router=express.Router();


const {signuprouter,postsignup,homepage,loginpage,logout,loginpost,profile}=require('../controllers/usercontolers')

const servercheck=require('../middlewares/signupmiddleware')

router.get('/',signuprouter)
router.get('/home',homepage)
router.get('/login',loginpage)
router.get('/logout',logout)
router.get('/User/profile',profile)

router.post('/signup',servercheck,postsignup);
router.post('/login',loginpost)

module.exports=router;