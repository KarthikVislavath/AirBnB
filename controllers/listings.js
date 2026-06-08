const Listing=require("../models/listing.js");

module.exports.index=async(req,res)=>{
   const allListings = await Listing.find({});
   res.render("listings/index",{allListings});
};

module.exports.renderNew=(req,res)=>{
  
    res.render("listings/new");
}

module.exports.showListing=async(req,res)=>{
    let {id} =req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if (!listing) {
        req.flash("error","Listing doesn't exist!");
        return res.redirect("/listings");
    }  
    res.render("listings/show",{listing});
}

module.exports.createListing=async(req,res,next)=>{
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  if (req.file) {
    newListing.image = { url: req.file.path, filename: req.file.filename };
  }
  await newListing.save();
  req.flash("success","New Listing Created!");
  res.redirect("/listings");

}

module.exports.editListing=async (req,res)=>{
    let {id} =req.params;
    const listing = await Listing.findById(id);
     if (!listing) {
        req.flash("error","Listing doesn't exist!");
        return res.redirect("/listings");
    }  
    let originalImageUrl=listing.image.url; 
    originalImageUrl= originalImageUrl.replace("/upload","/upload/,w_250");
    res.render("listings/edit",{listing,originalImageUrl});
}

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    const updatedData = { ...req.body.listing };
    if (req.file) {
      updatedData.image = { url: req.file.path, filename: req.file.filename };
    }
    await Listing.findByIdAndUpdate(id, updatedData);
    req.flash("success","New Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}