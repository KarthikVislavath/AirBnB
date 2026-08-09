if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const dbUrl=process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected to DB");
})
    .catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(dbUrl);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));




const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

store.on("error",(err)=>{
    console.log("Error in Mongo Session Store",err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //Stores user.id in session
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;
    next();
});



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/",userRouter);

// 404 handler
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// error handler
app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err);
    if (err.stack) console.error(err.stack);
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("listings/error", { message });
    //   res.status(status).send(message);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`app is working on ${port} port`);
});
