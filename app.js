var express =    require("express"),
    app =        express(),
    bodyParser = require("body-parser"),
    mongoose =   require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds"),
    flash = require("connect-flash"),
    moment = require("moment");
    
// requiring comment,campground, and index files
var commentRoutes =    require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes =      require("./routes/index");
    
// Executing variables
// mongoose.connect("mongodb://localhost/yelp_camp_v13deployed");
mongoose.connect("mongodb://yelpcamp:password123@ds259070.mlab.com:59070/webdev-yelpcamp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();// Seed the database

// ==============================
// EXPRESS SESSION & PASSPORT CONFIGURATION
// ==============================
// STEP 1: Setup express session (nothing to do with config passport yet in STEP1)
app.use(require("express-session")({
    secret:"Amin is the most stupid man on earth",
    resave: false,
    saveUninitialized: false
}));

// STEP 2: passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// This will check if the current user is logged in. this will be used in header.ejs and in real app, you can see if the current user is signed in.
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// using the required index, campground, and comment files 
app.use(indexRoutes),
app.use("/campgrounds",campgroundRoutes),
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server Started. Welcome!");
});