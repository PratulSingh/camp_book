var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var flash=require("connect-flash");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var Campground=require("./models/campground");
var Comment=require("./models/comment");
var User=require("./models/user");
var seedDB=require("./seeds");
var methodOverride=require("method-override");

var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var indexRoutes=require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_deploy";
mongoose.connect(url,  {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

//local db
//mongoose.connect('mongodb://localhost:27017/yelp_camp_deploy', {useNewUrlParser: true, useUnifiedTopology: true});

//nongo db lab db
//mongoose.connect('mongodb+srv://root:root@cluster0-gn6nd.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
//TO USE CUSTOM STYLE SHEETS
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.locals.moment = require('moment');

//Uncomment following line to activate seedDB
//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
		secret: "Rusty is the cutest",
		resave: false,
		saveUninitialized: false
		}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
	next();
});
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

//EDIT CAMPGROUND ROUTE

//UPDATE CAMPGROUND ROUTE

//Tell express to listen for requests(start server)
   // app.listen(3000, function() { 
     // console.log('Server listening on port 3000'); 
    // });
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});