var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({

    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
        username:String   
    },
   
    content:String
})

module.exports = mongoose.model("comment",commentSchema);