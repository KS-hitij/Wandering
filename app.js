if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}
const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override"); 
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const { date } = require("joi");
const passport = require("passport");
const localStrategy = require("passport-local");
const user = require("./models/user.js");
const { error } = require("console");
app.use(cookieParser());
app.use(methodOverride("_method"));
//ejs setup
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine("ejs",ejsMate); //for ejs-mate
const dbUrl= process.env.ATLASDB_URL;

const store= MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter: 24*60*60
})

store.on("error",()=>{
    console.log("Error in monngo session store",error);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        httpOnly: true
    }
};

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use("/",(req,res,next)=>{
    res.locals.currUser = req.user;
    next();
})

app.use(express.static(path.join(__dirname,"/public")));

//function to connect to mongodb server
async function main() {
    await mongoose.connect(dbUrl);
}

main()
.then(()=>{
    console.log("connected to mongodb");
    
})
.catch((err)=>{
    console.log(err);
})

app.use("/user",userRouter);

app.use("/listing",listingRouter);

app.use("/listing/:id/reviews",reviewsRouter)

app.get("/",(req,res)=>{
    res.redirect("/listing");
})


app.all("*",(req,res,next)=>{
    console.log("Yo");
    next(new ExpressError(404,"Page Not Found!"));
})

//middleware to handle errors
app.use((err,req,res,next)=>{
    let {statusCode=500, message="Something Went Wrong!"} = err;
    res.render("error",{statusCode,message});
})

app.listen(port,()=>{
    console.log("listening to the server");
})