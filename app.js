const express=require('express')
const app=express()
const mongoose=require('mongoose')
const bodyparse=require('body-parser')
const session=require('express-session')
const env=require('dotenv')
const nocache=require('nocache')
env.config()

const userRouter=require('./routes/userrouter')
const adminRouter=require('./routes/adminroutes')


app.use(session({
    // Using secret key from envornment varibale m
    secret:process.env.SESSION_SECRET, 
    resave:false,
    saveUninitialized:true,
    cookie:{
        sameSite:"strict"
    }
}))



app.use(express.static('public'));

app.set("view engine","ejs");

app.use(express.json())

app.use(bodyparse.urlencoded({extended:true}))

app.use('/',userRouter)
app.use('/',adminRouter)

app.use(nocache())

mongoose.connect("mongodb://localhost:27017/newproject")
app.listen(3900);