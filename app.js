const express=require('express')
const app=express()
const Router=require('./routes/')

app.set("view engine","ejs");
app.use(express.json())

app.use('/',Router)

app.listen(3500)