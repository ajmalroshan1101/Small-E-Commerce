const multer=require('multer');
const path=require('path');


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/uploads/')
    },
    filename:function(req,file,cb){
        cb(null,file.filename + "-" + Date.now() + path.extname(file.originalname));
    }
});

const uploads=multer({storage});

module.exports = uploads;