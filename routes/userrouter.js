const express=require('express')
const router=express.Router();

const {signuprouter}=require('../controllers/controlcenter')

router.get('/',signuprouter)

module.exports=router