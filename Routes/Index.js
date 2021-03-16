var express     = require("express");
var router      = express.Router();
var User        = require("../models/user");
var passport    = require("passport");
//HOME PAGE
router.get("/",function(req,res){
   
    res.render("Campgrounds/home.ejs");
});


// REGISTER ROUTES
router.get("/register",function(req,res){
    res.render("User/register.ejs");
})

//REGISTRATION LOGIC

router.post("/register",function(req,res){

    var newUser= new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){

        if(err){
            return res.render("User/register.ejs");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        })
    })
})

//LOGIN FORM
router.get("/login",function(req,res){
    res.render("User/login.ejs");
})

//LOGIN LOGIC
router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){

});

// IsLoggedIn?????????????
function IsLoggedIn(req,res,next){

    if(req.isAuthenticated()){
       return next();
    }
    res.redirect("/login");
}

//LOGOUT
router.get("/logout",function(req,res){

    req.logout();
    res.redirect("/campgrounds");
})

module.exports = router;