var mongoose = require("mongoose");
var Restaurant = require("./models/restaurant.js");
var Comment = require("./models/comment.js");

var data = [
    {
        name: "Cloud's Rest",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores quibusdam recusandae libero nihil minus esse sapiente ex necessitatibus dicta, facere eligendi repudiandae veniam, ipsum inventore debitis fugit sit tempore incidunt."
    },
    {
        name: "Desert Mesa",
        image: "https://cdn-az.allevents.in/banners/5f462161c423bf6fccf4178b03914836",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores quibusdam recusandae libero nihil minus esse sapiente ex necessitatibus dicta, facere eligendi repudiandae veniam, ipsum inventore debitis fugit sit tempore incidunt."
    },
    {
        name: "Canyon Floor",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores quibusdam recusandae libero nihil minus esse sapiente ex necessitatibus dicta, facere eligendi repudiandae veniam, ipsum inventore debitis fugit sit tempore incidunt."
    }
];

function seedDB() {
    Restaurant.deleteMany({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("Removed campgrounds!!!");
        data.forEach(function (seed) {
            Restaurant.create(seed, function (err, restaurant) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Added campground");
                    Comment.create({
                        text: "This place is great, but i wish there was internet",
                        author: "Hommer"
                    }, function(err, comment) {
                        if(err) {
                            console.log(err);
                        }else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Added new comment");
                        }
                    })
                }
            });
        });
    });
}

module.exports = seedDB;