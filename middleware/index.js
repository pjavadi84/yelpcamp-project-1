var Campground = require("../models/campground");
var Comment = require("../models/comment");


// All middlewares goes here
var middlewareObj = {};



// *****MIDDLEWARE 2: check campground ownership*****
middlewareObj.checkCampgroundOwnership = function(req, res, next){
        Campground.findById(req.params.id, function(err, foundCampground){
        // "||" means OR. "!" means "not". if err OR foundCampground can't be handled, you can run the next block
        // without || !foundCampground, if a user in a page change the value of length of the 
        // campground id, the application will crash. 
        if(err || !foundCampground){
            req.flash("error","Campground not found");
            res.redirect("/campgrounds");
            } else if(foundCampground.author.id.equals(req.user._id)) {
                    req.campground = foundCampground;
                    next();
                } else {
                    req.flash("error","You don't have permission to do that");
                    res.redirect("/campgrounds/" + req. params.id);
                }
            });
        }
   




// *****MIDDLEWARE 2: check Comment ownership*****
middlewareObj.checkCommentOwnership = function(req, res, next){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err || !foundComment){
                req.flash('error', 'Sorry, that comment does not exist!');
                res.redirect("/campground");
                } else if(// Does user own the comment?
                foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                        req.comment = foundComment;
                        next();
                    } else {
                        req.flash("error","You don't have permission to do that");
                        res.redirect("back");
                    }
                });
            },


// *****MIDDLEWARE 3: check if user loggedin*****
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    // req.flash goes before redirect
    req.flash("error", "You need to be logged in");
    res.redirect("/login");
}

module.exports = middlewareObj