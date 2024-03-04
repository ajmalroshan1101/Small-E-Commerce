const multer=require('multer');
const path=require('path');


const storage=multer.diskStorage({
    destination:function(req,file,cb){ 
        cb(null,'public/uploads/')
    },
    filename:function(req,file,cb){
        console.log("File from multer",file)
        cb(null,Date.now() + "-"+file.originalname );
    }
});

const uploads=multer({storage});

module.exports = uploads;