var express = require("express");
const { findByIdAndUpdate } = require("../models/campSchema");
var router  = express.Router();
var Camp = require("../models/campSchema");
var middleware = require("../middleware");
router.get("/campgrounds",function(req,res){
   
    //console.log(req.user);
    Camp.find({},function(err,allcamp){
        if(err){
            console.log("Error!");
        }else{
            res.render("Campgrounds/index.ejs",{allcamp:allcamp});
        }
    });
    
});



//FORM TO CREATE NEW CAMPGROUND (GET METHOD)
router.get("/campgrounds/new",middleware.IsLoggedIn,function(req,res){
    res.render("Campgrounds/newCampgrounds.ejs");
})

//SHOW ROUTE
router.get("/campgrounds/:id",function(req,res){

    Camp.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log("ERROR IN FINDING!!!");
        }else{
            res.render("Campgrounds/show.ejs",{Campground:foundCampground});
        }
    })
})

//POST ROUTE FOR SUBMITTING FORM AND CREATING NEW CAMPGROUND
router.post("/campgrounds",middleware.IsLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var author ={
        id:req.user._id,
        username : req.user.username
    }
    //console.log(description);
    var new_camp={name:name , image:image ,author:author, description:description};
    //ADDING NEW_CAMP TO DB
    Camp.create(new_camp,function(err,newlyCreatedCamp){

        if(err){
            console.log("ERROR!");
        }else{
            console.log(newlyCreatedCamp);
            //REDIRECT TO INDEX PAGE
            res.redirect("/campgrounds");
        }
    });
    
})

//GET EDIT FORM
router.get("/campgrounds/:id/edit",middleware.campgroundOwnership,function(req,res){
    Camp.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("Campgrounds/editCampgrounds.ejs",{Campground:foundCampground});
        }
    })
})

//UPDATING CAMPGROUND
router.put("/campgrounds/:id",middleware.campgroundOwnership,function(req,res){

    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var author ={
        id:req.user._id,
        username : req.user.username
    }
    //console.log(description);
    var updated_camp={name:name , image:image ,author:author, description:description};
    Camp.findByIdAndUpdate(req.params.id,updated_camp,function(err,updatedCampground){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds/"+updatedCampground._id);
        }
    })
})

//DELETE ROUTE
router.delete("/campgrounds/:id",middleware.campgroundOwnership,function(req,res){

    Camp.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    })
})

module.exports = router;