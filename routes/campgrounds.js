var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");


//SHOW ALL CAMPGROUNDS
router.get("/",function(req,res){
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
					if(err){
						console.log(err);
					} else {
						 res.render("campgrounds/index",{campgrounds:allCampgrounds});
					}
		
		});   
});

//POST
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

router.post("/", middleware.isLoggedIn, function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var price=req.body.price;
	var desc=req.body.description;
	var author={
		id: req.user._id,
		username: req.user.username
	};
    var newCampground={name:name, image:image, description:desc, author:author, price:price};
	
	//CREATE A NEW CAMPGROUND AND SAVE TO DB
	Campground.create(newCampground, function(err, newlyCreated){
					if(err){
						console.log(err);
					} else {
						 req.flash("success","Successfully added!");
						 res.redirect("/campgrounds");
					}
	});
});

//SHOW
router.get("/:id", function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground})
		}
	});
});

//EDIT CAMPGROUNDS
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
		Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground});
		});	
});
	
//UPDATE ROUTE
router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			req.flash("success","Successful edit!");
			res.redirect("/campgrounds/" +req.params.id);
		}
	});
});

//DESTROY ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports=router;
