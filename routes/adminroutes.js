const express = require("express");
const router1 = express.Router();
const upload = require("../middlewares/multerConfig");

const {
  AdminHome,
  ADlogout,
  userlist,
  deleteuserid,
  productHome,
  addproduct,
  ADDproduct,
  showproductlist,
  deleteproduct,
  showupdateproduct,
  Updateproduct,
  productcategory,
  postcategory,
  selectproductcategory,
  productuploads,
  newproductlist,
  findsubproduct,
  findSelectProduct
} = require("../controllers/admincontrollers");

router1.get("/AdminHome", AdminHome);

router1.get("/adLogout", ADlogout);

router1.get("/AdminHome/userlist", userlist);

router1.get("/AdminHome/product", productHome);

router1.get("/AdminHome/Add-product", addproduct);

router1.get("/AdminHome/Productlist", showproductlist);

router1.get("/AdminHome/update-product/:productId", showupdateproduct); //Here the :productId is like a variable which as value for the params

router1.get("/AdminHome/product_category", productcategory);

router1.get('/AdminHome/select-product-category/:id',selectproductcategory);

router1.get('/AdminHome/newproductlist', newproductlist);

router1.get('/findsubproduct/:id' , findsubproduct)

router1.get('/findSelectProduct/:id/:color/:size/:fabric', findSelectProduct)

//post
router1.post("/delete-user/:userId", deleteuserid);

router1.post("/add-product", upload.single("productImage"), ADDproduct);

router1.post("/delete-product/:productId", deleteproduct);

router1.post(
  "/AdminHome/update-product/:productId",
  upload.single("productImage"),
  Updateproduct
);

router1.post("/product-category", postcategory);

router1.post('/uploads',upload.single('img'),productuploads);

module.exports = router1;
