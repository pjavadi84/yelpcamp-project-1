var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
// ===============================
// CAMPGROUND ROUTES
// ===============================

// =================================================================================================================================
// Route2: INDEX
// =================================================================================================================================
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});




// =================================================================================================================================
//Route3: CREATE
// =================================================================================================================================
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form, add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image:image, description: desc, price: price, author: author};
    // Create a new camptround and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            // redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});



// =================================================================================================================================
// Route 4: NEW
// =================================================================================================================================
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});





// =================================================================================================================================
// Route 5: SHOW
// =================================================================================================================================
router.get("/:id", function(req, res){
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            res.flash("error", "Campground not found");
            return res.redirect("back");
        } else {
            console.log(foundCampground);
    // render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});





// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@********************************$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// NOTE: THE Edit, Update, and Destroy Routes use checkCampgroundOwnership middleware to ONLY authorize the user who is LOGGED IN 
// to be able to edit, update, and destroy the post. OTHER users CANNOT do these because the middleware jump up to prevent from such
// happening.
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@********************************$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$





// =================================================================================================================================
// EDIT CAMPGROUND ROUTE
// =================================================================================================================================
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
 Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("/campgrounds");
            } else {
        res.render("campgrounds/edit", {campground: foundCampground});
            }
    });
});




// =================================================================================================================================
// UPDATE CAMPGROUND ROUTE
// =================================================================================================================================
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            // redirect showhere (show page)
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});



// =================================================================================================================================
// DESTROY CAMPGROUND ROUTE
// =================================================================================================================================
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});



module.exports = router;