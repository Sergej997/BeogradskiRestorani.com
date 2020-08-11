var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant");
var Review = require("../models/review");
var middleware = require("../middleware");

router.get("/", function (req, res) {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    var noMatch='';
    Restaurant.find({name:regex}, function(err, allRestaurants) {
        if(err) {
            console.log(err);
        }else {
            if(allRestaurants.length < 1) {
                noMatch = "No restaurants match this search. Please try again!"
            }
            res.render("restaurants/index", {restaurants: allRestaurants, noMatch: noMatch});
        }
    });
  } else if(req.query.province) {
      const regex = new RegExp(escapeRegex(req.query.province), 'gi');
      var noMatch='';
      Restaurant.find({province:regex}, function(err, allRestaurants) {
        if(err) {
            console.log(err);
        }else {
            if(allRestaurants.length < 1) {
                noMatch = "No restaurants match this search. Please try again!"
            }
            res.render("restaurants/index", {restaurants: allRestaurants, noMatch: noMatch});
        }
    });
  } else {
    Restaurant.find({}, function (err, allRestaurants) {
      if (err) {
        console.log(err);
      } else {
        res.render("restaurants/index", {
          restaurants: allRestaurants,
          currentUser: req.user,
          page: "restaurants",
          noMatch: noMatch
        });
      }
    });
  }
});

router.post("/", middleware.isLoggedIn, function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var province = req.body.province;
  var street = req.body.street;
  var newRestaurant = {
    name: name,
    image: image,
    province: province,
    street: street,
    description: description,
    author: {
      id: req.user._id,
      username: req.user.username,
    },
  };
  Restaurant.create(newRestaurant, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      console.log(newlyCreated);
      res.redirect("/restaurants");
    }
  });
});

router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("restaurants/new.ejs");
});

router.get("/:id", function (req, res) {
  Restaurant.findById(req.params.id).populate("comments").populate({
      path: "reviews",
      options: {sort: {createdAt: -1}}
  }).exec(function (err, foundRestaurant) {
      if (err) {
          console.log(err);
      } else {
          res.render("restaurants/show", {restaurant: foundRestaurant});
      }
  });
});

router.get("/:id/edit", middleware.checkOwnership, function (req, res) {
  Restaurant.findById(req.params.id, function (err, foundRestaurant) {
    res.render("restaurants/edit", { restaurant: foundRestaurant });
  });
});

router.put("/:id", middleware.checkOwnership, function (req, res) {
  delete req.body.restaurant.rating;
  Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function (
    err,updatedRestaurant) {
    if (err) {
      res.redirect("/restaurants");
    } else {
      req.flash("success", "Restaurant successfully edited");
      res.redirect("/restaurants/" + req.params.id);
    }
  });
});

router.delete("/:id", middleware.checkOwnership, function (req, res) {
  Restaurant.findById(req.params.id, function (err, restaurant) {
      if (err) {
          res.redirect("/restaurants");
      } else {
          Comment.remove({"_id": {$in: restaurant.comments}}, function (err) {
              if (err) {
                  console.log(err);
                  return res.redirect("/restaurants");
              }
              Review.remove({"_id": {$in: restaurant.reviews}}, function (err) {
                  if (err) {
                      console.log(err);
                      return res.redirect("/restaurants");
                  }
                  restaurant.remove();
                  req.flash("success", "Restaurant deleted successfully!");
                  res.redirect("/restaurants");
              });
          });
      }
  });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
