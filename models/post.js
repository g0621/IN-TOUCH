var mongoose = require('mongoose');
var Comment = require('./comment');
var moment = require('moment');

var postSchema = mongoose.Schema({
    createdOn : String,
    image : String,
    about : String,
    author : {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        },
        displayName : String,
        displayPic : String
    },
    comment : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Comment'
        }
    ]
});

module.exports = mongoose.model('Post',postSchema);