var exp = require('express'),
    app = exp(),
    multer = require('multer'),
    mime = require('mime'),
    cloudinary = require('cloudinary'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    methodOverride = require('method-override');
    sanatize = require('express-sanitizer');

const fs = require('fs');

var configDB = require('./config/database');

mongoose.connect(configDB.url, {useMongoClient: true});

require('./config/passport')(passport);

//app.use(morgan('dev'));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(sanatize());
app.set("view engine", "ejs");
app.use(exp.static("public"));
app.use(session({                       //Extra material
    secret: process.env.SESSION_CRYPT_KEY || 'iLoveNodejs',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

require('./models/routes')(app, passport);

//app.listen(3000);
app.listen(process.env.PORT,process.env.IP);