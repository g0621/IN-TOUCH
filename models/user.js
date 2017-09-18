var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    displayName : String,
    displayPic : String,
    local: {
        email: String,
        password: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});
//because this doesnt use the pasport-mongoose-local which is used as plugin laterly
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};
module.exports = mongoose.model('User', userSchema);

