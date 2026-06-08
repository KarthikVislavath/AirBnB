const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: "listingimage",  
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1760311174612-4cc057f93e2c?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=967",
      set: (v) =>
        v.trim() === ""
          ? "https://images.unsplash.com/photo-1760311174612-4cc057f93e2c?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=967"
          : v,
    },
  },
  price: {
    type:Number,
    required:true,
  },
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref:"Review",
    },
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

