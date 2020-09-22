var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant");
var Review = require("../models/review");
var middleware = require("../middleware");
var Comment = require("../models/comment");

router.get("/", function (req, res) {
  const results = {};

  if(req.query.limit && req.query.page && req.query.province && !req.query.search) {
    //console.log("1");
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    const regex1 = new RegExp(escapeRegex(req.query.province), 'gi');
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    var noMatch='';
    Restaurant.find({name:regex, province: regex1}, function(err, allRestaurants) {
        if(err) {
            console.log(err);
        }else {
            if(allRestaurants.length < 1) {
                noMatch = "No restaurants match this search. Please try again!"
            }
            results.newRestaurants = allRestaurants.slice(startIndex, endIndex);

            results.next = {
              page: page + 1,
              limit: limit
            };
        
            results.prev = {
              page: page - 1,
              limit: limit
            };
            var search = req.query.search;
            var province = req.query.province;
            const mode = true;
            res.render("restaurants/index", {restaurants: results.newRestaurants, noMatch: noMatch, results: results,
            mode: mode, length: allRestaurants.length, search: search, province: province});
        }
    });

  }else if(req.query.limit && req.query.page && req.query.province && req.query.search) {
  
    
  }else if(req.query.limit && req.query.page && !req.query.search && !req.query.province) {
    //console.log("2");
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    Restaurant.find({}, function (err, allRestaurants) {
      if (err) {
        console.log(err);
      } else {
        results.newRestaurants = allRestaurants.slice(startIndex, endIndex);

          const mode = false;

          results.next = {
            page: page + 1,
            limit: limit
          };
      
          results.prev = {
            page: page - 1,
            limit: limit
          };
        
        var search;
        var province;
        
        res.render("restaurants/index", {
          restaurants: results.newRestaurants,
          length: allRestaurants.length,
          results: results,
          currentUser: req.user,
          page: "restaurants",
          search:search,
          province: province,
          mode: mode,
          noMatch: noMatch
        });
      }
    });
  }else if (req.query.search && req.query.province !== 'default' && !req.query.limit && !req.query.page) {
    //console.log("3");
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    const regex1 = new RegExp(escapeRegex(req.query.province), 'gi');
    const regex2 = new RegExp(escapeRegex(req.query.type), 'gi');
    var noMatch='';
    Restaurant.find({name:regex, province: regex1, type: regex2}, function(err, allRestaurants) {
        if(err) {
            console.log(err);
        }else {
            if(allRestaurants.length < 1) {
                noMatch = "No restaurants match this search. Please try again!"
            }
            var search = req.query.search;
            var province = req.query.province;
            const mode = true;
            res.render("restaurants/index", {restaurants: allRestaurants, noMatch: noMatch, results: results,
            mode: mode, length: allRestaurants.length, search: search, province: province});
        }
    });
  } else if(req.query.search && req.query.province === 'default') {
    //console.log("4");
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    const regex1= new RegExp(escapeRegex(req.query.type), 'gi');
    var noMatch='';
    Restaurant.find({name:regex, type: regex1}, function(err, allRestaurants) {
        if(err) {
            console.log(err);
        }else {
            if(allRestaurants.length < 1) {
                noMatch = "No restaurants match this search. Please try again!"
            }
            const mode = false;
            var search;
            var province;
            res.render("restaurants/index", {restaurants: allRestaurants, noMatch: noMatch, results: results, mode: mode,
            length: allRestaurants.length, search: search, province: province});
        }
    });
  } else if(req.query.province && req.query.province !== 'default' && !req.query.search && !req.query.limit && !req.query.page) {
    //console.log("5");
      const regex = new RegExp(escapeRegex(req.query.province), 'gi');
      const regex1 = new RegExp(escapeRegex(req.query.type), 'gi');
      var noMatch='';
      console.log(regex);
      console.log(req.query.province);
      Restaurant.find({province:regex, type: regex1}, function(err, allRestaurants) {
        if(err) {
            console.log(err);
        }else {
            if(allRestaurants.length < 1) {
                noMatch = "No restaurants match this search. Please try again!"
            }
            const mode = true;
            var search;
            var province = req.query.province;
            newRestaurants = allRestaurants.slice(0,8);
            res.render("restaurants/index", {restaurants: newRestaurants, noMatch: noMatch, results: results,
              mode: mode,
              length: allRestaurants.length, search: search, province: province});
        }
    });
  } else if(req.query.province && req.query.province === 'default' && !req.query.search && !req.query.limit && !req.query.page) {
    //console.log("55");
      const regex = new RegExp(escapeRegex(req.query.type), 'gi');
      var noMatch='';
      console.log(regex);
      console.log(req.query.province);
      Restaurant.find({type: regex}, function(err, allRestaurants) {
        if(err) {
            console.log(err);
        }else {
            if(allRestaurants.length < 1) {
                noMatch = "No restaurants match this search. Please try again!"
            }
            const mode = true;
            var search;
            var province = req.query.province;
            newRestaurants = allRestaurants.slice(0,8);
            res.render("restaurants/index", {restaurants: newRestaurants, noMatch: noMatch, results: results,
              mode: mode,
              length: allRestaurants.length, search: search, province: province});
        }
    });
  } else {
    //console.log("6");
    Restaurant.find({}, function (err, allRestaurants) {
      if (err) {
        console.log(err);
      } else {
        const mode = false;
        var search;
        var province;
        newRestaurants = allRestaurants.slice(0, 8);
        res.render("restaurants/index", {
          restaurants: newRestaurants,
          currentUser: req.user,
          results: results,
          mode: mode,
          page: "restaurants",
          length: allRestaurants.length,
          noMatch: noMatch,
          search: search,
          province: province
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
  var type = req.body.type;
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
    type: type
  };
  Restaurant.create(newRestaurant, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      //console.log(newlyCreated);
      res.redirect("/restaurants");
    }
  });
});

router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("restaurants/new.ejs");
});

router.get("/:id", function (req, res) {
  var restaurants = [];
  Restaurant.findById(req.params.id).populate("comments").populate({
      path: "reviews",
      options: {sort: {createdAt: -1}}
  }).exec(function (err, foundRestaurant) {
      if (err) {
          console.log(err);
      } else {
          foundRestaurant.similarRestaurants.forEach(function(code) {
            Restaurant.findById(code, function(err, fndRest) {
                //console.log("code ->"+code);
                //console.log("id ->"+fndRest._id);
                restaurants.push(fndRest);
                //console.log(restaurants);
                //console.log("__________________________");
              })
          })

          setTimeout(function() {
            res.render("restaurants/show", {restaurant: foundRestaurant, restaurants: restaurants});
          },100)

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
