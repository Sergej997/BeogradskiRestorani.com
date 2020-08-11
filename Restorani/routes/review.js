var express = require("express");
var router = express.Router({mergeParams: true});
var Restaurant = require("../models/restaurant");
var Review = require("../models/review");
var middleware = require("../middleware");

router.get("/", function (req, res) {
    Restaurant.findById(req.params.id).populate({
        path: "reviews",
        options: {sort: {createdAt: -1}} 
    }).exec(function (err, restaurant) {
        if (err || !restaurant) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/index", {restaurant: restaurant});
    });
});

router.get("/new", middleware.isLoggedIn, middleware.checkReviewExistence, function (req, res) {
    Restaurant.findById(req.params.id, function (err, restaurant) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/new", {restaurant: restaurant});

    });
});

router.post("/", middleware.isLoggedIn, middleware.checkReviewExistence, function (req, res) {
    Restaurant.findById(req.params.id).populate("reviews").exec(function (err, restaurant) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Review.create(req.body.review, function (err, review) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            review.author.id = req.user._id;
            review.author.username = req.user.username;
            review.restaurant = restaurant;
            review.save();
            restaurant.reviews.push(review);
            restaurant.rating = calculateAverage(restaurant.reviews);
            restaurant.save();
            req.flash("success", "Your review has been successfully added.");
            res.redirect('/restaurants/' + restaurant._id);
        });
    });
});

router.get("/:review_id/edit", middleware.checkReviewOwnership, function (req, res) {
    Review.findById(req.params.review_id, function (err, foundReview) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/edit", {restaurant_id: req.params.id, review: foundReview});
    });
});

router.put("/:review_id", middleware.checkReviewOwnership, function (req, res) {
    Review.findByIdAndUpdate(req.params.review_id, req.body.review, {new: true}, function (err, updatedReview) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Restaurant.findById(req.params.id).populate("reviews").exec(function (err, restaurant) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            restaurant.rating = calculateAverage(restaurant.reviews);
            restaurant.save();
            req.flash("success", "Your review was successfully edited.");
            res.redirect('/restaurants/' + restaurant._id);
        });
    });
});

router.delete("/:review_id", middleware.checkReviewOwnership, function (req, res) {
    Review.findByIdAndRemove(req.params.review_id, function (err) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Restaurant.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.review_id}}, {new: true}).populate("reviews").exec(function (err, restaurant) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            restaurant.rating = calculateAverage(restaurant.reviews);
            restaurant.save();
            req.flash("success", "Your review was deleted successfully.");
            res.redirect("/restaurants/" + req.params.id);
        });
    });
});

function calculateAverage(reviews) {
    if (reviews.length === 0) {
        return 0;
    }
    var sum = 0;
    reviews.forEach(function (element) {
        sum += element.rating;
    });
    return sum / reviews.length;
}

module.exports = router;