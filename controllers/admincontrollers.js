const bcrypt = require("bcrypt");

const User = require("../models/usersdata");

const Product = require("../models/product");
const products = require("../models/product");

const categories = require("../models/new-product-category");
const newproduct = require("../models/selectedproducts");

const obj = {
  AdminHome: (req, res) => {
    try {
      // If there is admin
      if (req.session.userId && req.session.Isadmin) {
        res.render("AdminHome");
      } else {
        res.redirect("/login");
      }
    } catch (err) {}
  },

  ADlogout: (req, res) => {
    // This is the way to destory a session
    req.session.destroy((err) => {
      if (err) {
        res.status(500).send("destory is not working");
      } else {
        res.redirect("/login");
      }
    });
  },

  userlist: async (req, res) => {
    try {
      if (req.session.userId && req.session.Isadmin) {
        // Fetch user details from the database
        const users = await User.find({});

        // Render the 'userlist' view and pass the user details
        res.render("userlist", { users });
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  // Here the product is getting destoryed
  deleteuserid: async (req, res) => {
    try {
      // Collecting ObjectId using params
      const userId = req.params.userId;

      const user = await User.findById(userId);

      // If the object id match to admin id then user can't able to delete;

      if (user.usertype === "admin") {
        console.log("Admin user cannot be deleted:", userId);

        res.status(403).json({ message: "Admin user cannot be deleted" });
      } else {
        // If the objectid is a user's then the user will get deleted from the database;

        const result = await User.findByIdAndDelete(userId);

        console.log("Deletion result:", result);

        res.redirect("/AdminHome/userlist");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  },
  // Product Homepage
  productHome: (req, res) => {
    if (req.session.userId && req.session.Isadmin) {
      res.render("products");
    } else {
      res.redirect("/AdminHome");
    }
  },
  // page for adding product
  addproduct: (req, res) => {
    if (req.session.userId && req.session.Isadmin) {
      res.render("AddProduct");
    } else {
      res.redirect("/AdminHome");
    }
  },

  ADDproduct: async (req, res) => {
    // destructuring Data form the request
    const { productName, productPrice, productDescription } = req.body;

    console.log({ productName, productPrice, productDescription });

    // Image is rendring
    const imageurl = req.file
      ? `/uploads/${req.file.filename}`
      : "/default-image.jpg";

    // Here a new prodcut is adding to the collection
    const newproduct = new Product({
      productname: productName,
      price: productPrice,
      description: productDescription,
      image: imageurl,
    });

    try {
      await newproduct.save();

      res.redirect("/AdminHome/Productlist");
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  },
  showproductlist: async (req, res) => {
    try {
      if (req.session.userId && req.session.Isadmin) {
        // Here we are finding all the product in the collection
        const products = await Product.find({});

        res.render("Productlist", { products });
      } else {
        res.redirect("/AdminHome");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  },

  deleteproduct: async (req, res) => {
    // Here the ObjectId of the product from the user is get through req.params

    const productId = req.params.productId;

    try {
      // Here the product is find and delete by using the productId
      await products.findByIdAndDelete(productId);

      // redirect the page;
      res.redirect("/AdminHome/Productlist");
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  },
  // Fuction for showing the Update form
  showupdateproduct: async (req, res) => {
    try {
      // Here the page will only work when both session and Isadmin is "true"

      if (req.session.userId && req.session.Isadmin) {
        // Here the object is collected by req.params
        const updateid = req.params.productId;

        // Here the product is find by the object id and store in product

        const product = await Product.findById(updateid);

        // Here the update form is render and the object detalis that has found will sent to the ejs
        res.render("updateform", { product });
      } else {
        res.redirect("/AdminHome");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  },

  Updateproduct: async (req, res) => {
    // Here the object is collected by req.params
    const useridup = req.params.productId;

    const product = await Product.findById(useridup);

    if (!product) {
      return res.status(404).send("product not found");
    }

    // replacing the data with new request data;
    product.productname = req.body.name;
    product.price = req.body.price;
    product.description = req.body.description;

    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    // Save the data to the database
    await product.save();

    res.redirect("/AdminHome/Productlist");
  },
  productcategory: (req, res) => {
    try {
      res.render("addcategory");
    } catch (err) {}
  },
  postcategory: async (req, res) => {
    const { title, company, category } = req.body;

    // const alreadyexist =await categories.findOne({category});
    const addcategory = new categories({
      title,
      company,
      category,
    });

    const show_category = await addcategory.save();

    const id = show_category._id.toString();

    console.log(id);
    res.redirect(`/AdminHome/select-product-category/${id}`);
  },

  selectproductcategory: (req, res) => {
    const id = req.params.id;

    res.render("select-product-category", { id });
  },
  productuploads: async (req, res) => {

    try {
      const imageurl = req.file
      ? `/uploads/${req.file.filename}`
      : "/default-image.jpg";
    const { color, febric, size, mrp, productid, selectedSize, stock } =
      req.body;

    const createproduct = new newproduct({
      color,
      febric,
      size,
      img: imageurl,
      mrp,
      productid,
      selectedSize,
      stock,
    });

    await createproduct.save();

    res.redirect("/AdminHome/newproductlist");

    } catch (error) {
      
    }
   
  },
  newproductlist: async (req, res) => {
    try {
      const find = await newproduct.find();
      res.render("newproductlistcate", { find });
      console.log("helloe world");
    } catch (error) {
      console.error("Error rendering template:", error);
      res.status(500).send("Internal Server Error");
    }
  },
  findsubproduct: async (req, res) => {
    try {
      const proid = req.params.id;

      // Here we find the product using the proid or productId get from the request
      const findProd = await categories.findOne({ _id: proid });
      if (!findProd) {
        return res.status(401).json({ message: "Wrong try" });
      }
      const findproductWithCategory = await categories.aggregate([
        {
          $match: { _id: findProd._id },
        },
        {
          $lookup: {
            from: "cateproducts",
            localField: "_id",
            foreignField: "productid",
            as: "categoryProducts",
          },
        },
      ]);

      // console.log(findproductWithCategory);
      res.status(200).json(findproductWithCategory);
    } catch (error) {
      console.log("ERROR", error);
    }
  },
  findSelectProduct: async (req, res) => {
    try {
      const { id, color, size, fabric } = req.params;
      console.log(req.params)
      const response = await newproduct.findOne({
        productid: id,
        color: `#${color}`,
        size,
        febric: fabric,
      });
      res.status(200).json({ response });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Something went wrong" });
    }
  },
};

module.exports = obj;
