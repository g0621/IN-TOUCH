var localstr = require('passport-local').Strategy;
var facebookstr = require('passport-facebook').Strategy;
var twitterstr = require('passport-twitter').Strategy;
var googlestr = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');

var configAuth = require('./auth');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    passport.use('local-signup', new localstr({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            process.nextTick(function () {
                if (!req.user) {
                    User.findOne({'local.email': email}, function (err, user) {
                        if (err) return done(err);
                        if (user) return done(null, false, req.flash('error', 'That Username is already taken'));
                        else {
                            var newUser = new User();
                            newUser.displayName = email;
                            newUser.local.email = email;
                            newUser.local.password = newUser.generateHash(password);
                            newUser.save(function (err) {
                                if (err) throw err;
                                req.flash('success','click avatar of profile-page to customize or login with facebook');
                                return done(null, newUser);
                            });
                        }
                    });
                } else {
                    var usr = req.user;
                    if(!usr.displayName) usr.displayName = email;
                    usr.local.email = email;
                    usr.local.password = usr.generateHash(password);
                    usr.save(function (err) {
                        if (err) throw err;
                        return done(null, usr);
                    });
                }
            });
        }));
    passport.use('local-login', new localstr({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        User.findOne({'local.email': email}, function (err, user) {
            if (err) return done(err);
            if (!user) return done(null, false, req.flash('error', 'No User found'));
            if (!user.validPassword(password)) return done(null, false, req.flash('error', 'oops! Wrong password'));
            req.flash('success','welcome back '+user.displayName +' :)');
            return done(null, user);
        });
    }));
    passport.use(new facebookstr({
            clientID: configAuth.facebookAuth.clientId,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            profileFields: ['id', 'emails', 'name', 'displayName', 'gender','picture.type(large)'],
            passReqToCallback: true
        },
        function (req, token, refreshToken, profile, done) {
            process.nextTick(function () {
                if (!req.user) {
                    User.findOne({'facebook.id': profile.id}, function (err, user) {
                        if (err) return done(err);
                        if (user) {
                            if (!user.facebook.token) {
                                if(!user.displayName) user.displayName = profile.displayName;
                                if(!user.displayPic) user.displayPic = profile.photos ? profile.photos[0].value : '/img/001-male-user.png';
                                user.facebook.token = token;
                                user.facebook.name = profile.displayName;
                                if(profile.emails !== undefined ) user.facebook.email = profile.emails[0].value;
                                user.save(function (err) {
                                    if (err) throw err;
                                    return done(null, user);
                                });
                            }
                            return done(null, user);
                        }
                        else {                                              ///Added console.log
                            var newUser = new User();
                            newUser.displayName = profile.displayName;
                            newUser.displayPic = profile.photos ? profile.photos[0].value : '/img/001-male-user.png';
                            newUser.facebook.id = profile.id;
                            newUser.facebook.token = token;
                            newUser.facebook.name = profile.displayName;        //profile.name.givenName + ' ' + profile.name.familyName;
                            if(profile.emails !== undefined ) newUser.facebook.email = profile.emails[0].value;
                            newUser.save(function (err) {
                                if (err) throw err;
                                return done(null, newUser);
                            });
                        }
                    });
                } else {
                    var usr = req.user;
                    if(!usr.displayName) usr.displayName = profile.displayName;
                    if(!usr.displayPic) usr.displayPic = profile.photos ? profile.photos[0].value : '/img/001-male-user.png';
                    usr.facebook.id = profile.id;
                    usr.facebook.token = token;
                    usr.facebook.name = profile.displayName;
                    if(profile.emails !== undefined )usr.facebook.email = profile.emails[0].value;
                    usr.save(function (err) {
                        if (err) throw err;
                        return done(null, usr);
                    });
                }
            });
        }));
    passport.use(new twitterstr({
            consumerKey: configAuth.twitterAuth.consumerKey,
            consumerSecret: configAuth.twitterAuth.consumerSecret,
            callbackURL: configAuth.twitterAuth.callbackURL,
            passReqToCallback: true
        },
        function (req, token, tokenSecret, profile, done) {
            process.nextTick(function () {
                if (!req.user) {
                    User.findOne({'twitter.id': profile.id}, function (err, user) {
                        if (err) done(err);
                        if (user) {
                            if (!user.twitter.token) {
                                if(!user.displayPic) user.displayPic = profile.photos ? profile.photos[0].value.replace('_normal','') : '/img/001-male-user.png';
                                if(!user.displayName) user.displayName = profile.displayName;
                                user.twitter.token = token;
                                user.twitter.displayName = profile.displayName;
                                user.save(function (err) {
                                    if (err) throw err;
                                    return done(null, user);
                                });
                            }
                            return done(null, user);
                        } else {
                            var newUser = new User();
                            newUser.displayName = profile.displayName;
                            newUser.displayPic = profile.photos ? profile.photos[0].value.replace('_normal','') : '/img/001-male-user.png';
                            newUser.twitter.id = profile.id;
                            newUser.twitter.token = token;
                            newUser.twitter.username = profile.username;
                            newUser.twitter.displayName = profile.displayName;
                            newUser.save(function (err) {
                                if (err) throw err;
                                return done(null, newUser);
                            });
                        }
                    });
                } else {
                    var usr = req.user;
                    if(!usr.displayName)usr.displayName = profile.displayName;
                    if(!usr.displayPic) usr.displayPic = profile.photos ? profile.photos[0].value.replace('_normal','') : '/img/001-male-user.png';
                    usr.twitter.id = profile.id;
                    usr.twitter.token = token;
                    usr.twitter.username = profile.username;
                    usr.twitter.displayName = profile.displayName;
                    usr.save(function (err) {
                        if (err) throw err;
                        return done(null, usr);
                    });
                }
            });
        }));
    passport.use(new googlestr({
            clientID: configAuth.googlekAuth.clientId,
            clientSecret: configAuth.googlekAuth.clientSecret,
            callbackURL: configAuth.googlekAuth.callbackURL,
            passReqToCallback: true
        },
        function (req, token, refreshToken, profile, done) {
            console.log(profile);
            process.nextTick(function () {
                if (!req.user) {
                    User.findOne({'google.id': profile.id}, function (err, user) {
                        if (err) return done(err);
                        if (user) {
                            if (!user.google.token) {
                                if(!user.displayPic) user.displayPic = profile.photos ? profile.photos[0].value.replace('50','200') : '/img/001-male-user.png';
                                if(!user.displayName) user.displayName = profile.displayName;
                                user.google.token = token;
                                user.google.name = profile.displayName;
                                user.save(function (err) {
                                    if (err) throw err;
                                    return done(null, user);
                                });
                            }
                            return done(null, user);
                        }
                        else {
                            var newUser = new User();
                            newUser.displayPic = profile.photos ? profile.photos[0].value.replace('50','200') : '/img/001-male-user.png';
                            newUser.displayName = profile.displayName;
                            newUser.google.id = profile.id;
                            newUser.google.token = token;
                            newUser.google.name = profile.displayName;
                            if(profile.emails !== undefined ) newUser.google.email = profile.emails[0].value;
                            newUser.save(function (err) {
                                if (err) throw err;
                                return done(null, newUser);
                            });
                        }
                    });
                } else {
                    var usr = req.user;
                    if(!usr.displayName) usr.displayName = profile.displayName;
                    if(!usr.displayPic) usr.displayPic = profile.photos ? profile.photos[0].value.replace('50','200') : '/img/001-male-user.png';
                    usr.google.id = profile.id;
                    usr.google.token = token;
                    usr.google.name = profile.displayName;
                    if(profile.emails !== undefined ) usr.google.email = profile.emails[0].value;
                    usr.save(function (err) {
                        if (err) throw err;
                        return done(null, usr);
                    });
                }
            });
        }));
};