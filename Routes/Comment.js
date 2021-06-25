var express = require("express");
var router  = express.Router();
var Comment = require("../models/comment");
var Camp = require("../models/campSchema");
var middleware = require("../middleware");
//GET FORM FOR COMMENT
router.get("/campgrounds/:id/comment/new",middleware.IsLoggedIn,function(req,res){
    Camp.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("Comments/comment.ejs",{Campground:foundCampground});
        }
    })
   
})

//CREATING COMMENT AND PUSHING INTO DB
router.post("/campgrounds/:id/comment",middleware.IsLoggedIn,function(req,res){
    
    var author={
        id:req.user._id,
        username:req.user.username
    };
    var newComment ={
        author:author,
        content:req.body.comment["content"],
        createTime:new Date()
    };
    Camp.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            Comment.create(newComment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    foundCampground.comments.push(comment._id);
                    foundCampground.save();
                   // console.log(foundCampground._id);
                   res.redirect("/campgrounds/"+foundCampground._id);
                }
            })
        }
    })
});

//EDIT COMMENT FORM
router.get("/campgrounds/:id/comment/:comment_id/edit",middleware.commentOwnership,function(req,res){

    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            console.log(err);
        }else{
            res.render("Comments/editComment.ejs",{Comment:foundComment,Campground_id:req.params.id});
        }
    })
})

//UPDATE COMMENT 
router.put("/campgrounds/:id/comment/:comment_id",middleware.commentOwnership,function(req,res){

    var author={
        id:req.user._id,
        username:req.user.username
    };
    var updatedComment ={
        author:author,
        content:req.body.comment["content"]
    };
    Comment.findByIdAndUpdate(req.params.comment_id,updatedComment,function(err,comment){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})

//DELETE ROUTE
router.delete("/campgrounds/:id/comment/:comment_id",middleware.commentOwnership,function(req,res){
    
        Comment.findByIdAndRemove(req.params.comment_id,function(err){
            if(err){
                console.log(err);
            }else{
                res.redirect("/campgrounds/"+req.params.id);
            }
        })    
})

module.exports = router;