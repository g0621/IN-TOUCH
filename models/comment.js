var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
    text : String,
    author : {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        },
        displayName : String,
        displayPic : String
    },
    createdOn : String
});

module.exports = mongoose.model('Comment',commentSchema);