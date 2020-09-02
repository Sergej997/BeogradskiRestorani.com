var Restaurant = require("../models/restaurant");


obj = {};

obj.number = function(req,res) {
       Restaurant.find({}, function (err, allRestaurants) {
        if (err) {
          return 0;
        } else {
           console.log(allRestaurants.length);
           var num = allRestaurants.length;
           return num;
        }
      });
}

module.exports = obj;

