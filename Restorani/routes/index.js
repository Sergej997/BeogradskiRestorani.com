var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Restaurant = require("../models/restaurant");
var Comment = require("../models/comment");

router.get("/", function (req, res) {
    res.render("landing");
});

router.get("/register", function(req,res) {
    res.render("register",{page: 'register'});
});

router.post("/register", function(req,res) {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        avatar: req.body.avatar
    });

    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to BeogradskiRestorani.com "+ user.username);
            res.redirect("/restaurants");
        });
    });
});

router.get("/login", function(req,res) {
    res.render("login",{page: 'login'});
});

router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/restaurants",
    failureRedirect: "/login"
}), function(req, res) {
});

router.get("/logout", function(req,res) {
    req.logOut();
    req.flash("success", "Logged you out!");
    res.redirect("/restaurants");
});

router.get("/users/:id", function(req,res) {
    User.findById(req.params.id, function(err, foundUser) {
        if(err) {
            req.flash("error", "Something went wrong");
            return res.redirect("/");
        }
        Restaurant.find().where('author.id').equals(foundUser._id).exec(function(err, restaurants){
            if(err) {
                req.flash("error", "Something went wrong");
                return res.redirect("/");
            }
            Comment.find().where('author.id').equals(req.params.id).exec(function(err, foundComm) {
                if(err) {
                    req.flash("error", "Something went wrong");
                    return res.redirect("/");
                }
                res.render("users/show", {user: foundUser, restaurants: restaurants, comments: foundComm});
            });

        });
    });
});

router.get("/users/:id/edit", function(req,res) {
    User.findById(req.params.id, function(err, foundUser) {
        if(err) {
            return res.redirect("/");
        }
        res.render("users/edit", {user: foundUser});
    });
});

router.put("/users/:id", function(req,res) {
   userData = req.body.user;
    User.findByIdAndUpdate(req.params.id,userData,function(err, updatedUser) {
        if(err) {
            return res.redirect("/");
        }
            req.flash("success", "User profile successfully updated");
            res.redirect("/users/" + req.params.id);
    });
}); 


module.exports = router;