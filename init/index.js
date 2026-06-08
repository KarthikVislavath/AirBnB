require("dotenv").config();

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initdata = require("./data.js");

async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);
}

main()
.then(() => {
    console.log("Connected to Atlas");
})
.catch((err) => {
    console.log(err);
});

const initDB = async () => {
    await Listing.deleteMany({});

    const dataWithOwner = initdata.data.map((obj) => ({
        ...obj,
        owner: "6a26c82f766f81745ccd5c0a"
    }));

    await Listing.insertMany(dataWithOwner);

    console.log("Data Initialized");
};

initDB();

