var Camp = require("../models/campSchema");
var Comment    = require("../models/comment");

var middlewareObj = {};

//COMMENT AUTHORIZATION
middlewareObj.commentOwnership=function (req,res,next){

    if(req.isAuthenticated()){

        Comment.findById(req.params.comment_id,function(err,comment){

            if(err){
                console.log(err);
            }else{
                if(req.user._id.equals(comment.author.id)){
                    next();
                }else{
                    res.redirect("back");
                }       
            }
        })
        
    }else{

        res.redirect("/login");
    }
}

//AUTHORIZATION
middlewareObj.campgroundOwnership = function (req,res,next){

    if(req.isAuthenticated()){

        Camp.findById(req.params.id,function(err,foundCampground){
            if(err){
                console.log(err);
            }else{

                if(foundCampground.author.id.equals(req.user._id)){
                    return next();
                }else{
                    res.redirect("back");
                }
            }
        })
    }else{
        res.redirect("/login");
    }
}

//AUTHENTICATION
 middlewareObj.IsLoggedIn= function (req,res,next){

    if(req.isAuthenticated()){
       return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;