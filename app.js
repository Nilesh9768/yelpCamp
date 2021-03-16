var express=require("express");
var app = express();
var mongoose=require("mongoose");
var bodyParser=require("body-parser");
var Camp = require("./models/campSchema");
var Comment =require("./models/comment");
const { findById } = require("./models/campSchema");
var User = require("./models/user");
var methodOverride = require("method-override");

//ROUTES
var CampgroundRoutes = require("./Routes/Campground"),
    CommentRoutes    = require("./Routes/Comment"),
    IndexRoutes      = require("./Routes/Index");

var localStrategy = require("passport-local"),
    passport    = require("passport");

var DBURL=process.env.DB_URL ||"mongodb://localhost:27017/yelp_camp_practice";
mongoose.connect(DBURL, {
    useNewUrlParser: true,
     useUnifiedTopology: true,
     useFindAndModify:false
});

app.use(express.static("Public"));
app.use(bodyParser.urlencoded({extended:true}));

// PASSPORT CONFIGURE
app.use(require('cookie-session')({
    secret:" ",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

//CURRENTUSER
app.use(function(req,res,next){

    res.locals.currentUser=req.user;
    next();
})

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(methodOverride("_method"));
app.use(CampgroundRoutes);
app.use(CommentRoutes);
app.use(IndexRoutes);

app.listen(process.env.port || 3000,function(){
    console.log("Server has started.....");
})