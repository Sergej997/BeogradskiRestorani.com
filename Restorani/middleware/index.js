var Restaurant = require("../models/restaurant");
var Comment = require("../models/comment");
var Review = require("../models/review");

middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to continue!");
  res.redirect("/login");
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user.id) || req.user.isAdmin) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to continue!");
    res.redirect("back");
  }
};

middlewareObj.checkReviewOwnership = function(req, res, next) {
  if(req.isAuthenticated()){
      Review.findById(req.params.review_id, function(err, foundReview){
          if(err || !foundReview){
              res.redirect("back");
          }  else {
              if(foundReview.author.id.equals(req.user._id) || req.user.isAdmin) {
                  next();
              } else {
                  req.flash("error", "You don't have permission to do that");
                  res.redirect("back");
              }
          }
      });
  } else {
      req.flash("error", "You need to be logged in to do that");
      res.redirect("back");
  }
};

middlewareObj.checkReviewExistence = function (req, res, next) {
  if (req.isAuthenticated()) {
      Restaurant.findById(req.params.id).populate("reviews").exec(function (err, foundRestaurant) {
          if (err || !foundRestaurant) {
              req.flash("error", "Restaurant not found.");
              res.redirect("back");
          } else {
              var foundUserReview = foundRestaurant.reviews.some(function (review) {
                  return review.author.id.equals(req.user._id);
              });
              if (foundUserReview) {
                  req.flash("error", "You already wrote a review.");
                  return res.redirect("/restaurants/" + foundRestaurant._id);
              }
              next();
          }
      });
  } else {
      req.flash("error", "You need to login first.");
      res.redirect("back");
  }
};

middlewareObj.checkOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Restaurant.findById(req.params.id, function (err, foundRestaurant) {
      if (err) {
        req.flash("error", "Restaurant not found!");
        res.redirect("back");
      } else {
        if (foundRestaurant.author.id.equals(req.user.id) || req.user.isAdmin) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to continue!");
    res.redirect("back");
  }
};

module.exports = middlewareObj;
