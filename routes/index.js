var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// ROUTE1: LANDING PAGE
router.get("/", function(req, res){
    res.render("landing");
});

// =================================
// AUTHENTICATION ROUTES
// =================================

// =======REGISTER ROUTE ======================
// STEP 1: CREATE REGISTER FORM and its logic
// step1a: To show the form
router.get("/register", function(req, res){
    res.render("register");
});
// step1b: handle signup logic
router.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
       if(err){
           req.flash("error", err.message);
           return res.redirect("/register");
       }
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to YelpCamp " + user.username);
           res.redirect("/campgrounds");
       });
   });
});

// ========LOGIN ROUTE ========================
// step1a: To show the form
router.get("/login", function(req, res){
    res.render("login");
});

// step1b: handle login logic
router.post("/login", passport.authenticate("local", 
{successRedirect: "/campgrounds", 
 failureRedirect: "/login",
}), function(req, res){});


// ======LOGOUT ROUTE============================
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "logged you out");
    res.redirect("/campgrounds");
});


module.exports = router;