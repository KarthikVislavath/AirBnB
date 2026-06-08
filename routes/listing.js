const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");

const listingcontroller=require("../controllers/listings.js")

const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })const uploadSingle = (field) => (req, res, next) => {
  upload.single(field)(req, res, (err) => {
    if (err) {
      console.error("File upload error:", err);
      return next(err);
    }
    next();
  });
};



router.route("/")
.get(wrapAsync(listingcontroller.index))
.post(isLoggedIn, uploadSingle('listing[image]'), validateListing, wrapAsync(listingcontroller.createListing));



//NEW ROUTE 
router.get("/new",isLoggedIn, listingcontroller.renderNew
)

//Show Route
router.route("/:id")
.get(wrapAsync(listingcontroller.showListing))
.put(isLoggedIn,isOwner, uploadSingle('listing[image]'), validateListing, wrapAsync(listingcontroller.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingcontroller.deleteListing));

//Edit
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingcontroller.editListing))


module.exports=router;