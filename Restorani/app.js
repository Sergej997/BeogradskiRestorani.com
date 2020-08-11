var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Restaurant = require("./models/restaurant.js");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Comment = require("./models/comment");
var flash = require("connect-flash");
var User = require("./models/user");
//var seedDB = require("./seeds.js");
var methodOverride = require("method-override");
var commentRoutes = require("./routes/comments");
var restaurantRoutes = require("./routes/restaurants");
var indexRoutes = require("./routes/index");
var reviewRoutes = require("./routes/review");

//seedDB();
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

mongoose.connect("mongodb://localhost/restoran");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname+ "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

//passport settings
app.use(require("express-session")({
    secret:"Bloodborne rules!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/restaurants",restaurantRoutes);
app.use("/restaurants/:id/comments",commentRoutes);
app.use("/restaurants/:id/reviews", reviewRoutes);

app.listen(3000, function () {
    console.log("Server has started");
});