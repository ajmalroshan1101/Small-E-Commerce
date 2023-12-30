const express=require('express')
const router=express.Router();


const {signuprouter,postsignup,homepage,loginpage,logout,loginpost,profile,Editprofile,postEditeprofile,viewproduct}=require('../controllers/usercontolers')

const servercheck=require('../middlewares/signupmiddleware')

router.get('/',signuprouter)
router.get('/home',homepage)
router.get('/login',loginpage)
router.get('/logout',logout)
router.get('/User/profile',profile)
router.get('/edit-profile',Editprofile)
router.get('/product-view/:productId',viewproduct)

router.post('/signup',servercheck,postsignup);
router.post('/login',loginpost)
router.post('/user/editProfile',postEditeprofile)

module.exports=router;