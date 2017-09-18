var Post = require('./post');
var Comment = require('./comment');
var User = require('./user');
var moment = require('moment');
var multer = require('multer');
var mime = require('mime');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '.' + mime.extension(file.mimetype));
    }
});
var upload = multer({storage: storage});
const fs = require('fs');
var cloudinary = require('cloudinary');
var configColud = require('../config/auth');
cloudinary.config({
    cloud_name: configColud.cloudinary.cloud_name,
    api_key: configColud.cloudinary.api_key,
    api_secret: configColud.cloudinary.api_secret
});


module.exports = function (app, passport) {

    //INDEX ROUTES HERE

    app.get('/', function (req, res) {
        Post.find({}).populate('comment').exec(function (err, posts) {
            if (err) {
                req.flash('error', err.message);
                res.render('welcome');
            } else {
                res.render('showPage', {post: posts.reverse()});
            }
        });
    });

    app.get('/allusers',function (req,res) {
        User.find({},function (err,users) {
            if(err){
                req.flash('error', err.message);
                res.render('welcome');
            }else {
                res.render('allUsers',{users : users.reverse()});
            }
        })
    });

    //ALL PROFILE ROUTES HERE.

    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile', {user : req.user});
    });

    app.get('/profile/:id/editProfile',checkProfileAuth,function (req,res) {
        User.findById(req.params.id,function (err,user) {
            if(err){req.flash('error',err.message);res.redirect('/')}
            else res.render('profileEdit',{user : user});
        });
    });

    app.put('/profile/:id',checkProfileAuth,upload.single('displayPic'),function (req,res) {
        if(req.file){
            cloudinary.uploader.upload(req.file.path,function (result) {
                var picURL = result.url;
                fs.unlink(req.file.path,function (err) {});
                User.findById(req.params.id,function (err,user) {
                    if(err){req.flash('error',err.message);res.redirect('/')}
                    else {
                        user.displayName = req.body.displayName;
                        user.displayPic = picURL;
                        user.save();
                        console.log(user);
                        res.redirect('/profile');
                    }
                })
            });
        }else {
            User.findByIdAndUpdate(req.params.id,{displayName : req.body.displayName},function (err,user) {
                if(err){req.flash('error',err.message);res.redirect('/')}
                else {
                    req.flash('success','Profile Updated');
                    res.redirect('/profile');
                }
            })
        }
    });

    //ALL THE ROUTES FOR LOGIN LOGOUT SIGNUP GOES HERE

    app.get('/login', function (req, res) {
        res.render('localLogin');
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', function (req, res) {
        res.render('localSignup');
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true,
        successFlash : ''
    }));

    app.get('/logout', function (req, res) {
        req.logOut();
        res.redirect('/');
    });

    //ALL THE ROUTES FOR LOCAL AUTH GOES HERE

    app.get('/connect/local', function (req, res) {
        res.render('localSignup');
    });

    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/connect/local',
        failureFlash: true,
        successFlash : 'Connected Successfully :)'
    }));

    app.get('/unlink/local', function (req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            if(err) {req.flash('error', err.message) ; res.redirect('/');}
            else {req.flash('success','Removed Successfully :)');res.redirect('/profile');}
        });
    });

    //AUTH AND EVERYTHING FOR FACEBOOK GOES HERE


    app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/',
        failureFlash: true
    }));

    app.get('/connect/facebook', passport.authorize('facebook', {scope: ['email']}));

    app.get('/connect/facebook/callback', passport.authorize('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/',
        failureFlash: true
    }));

    app.get('/unlink/facebook', function (req, res) {
        var user = req.user;
        user.facebook.token = undefined;
        user.save(function (err) {
            if(err){req.flash('error',err.message);res.redirect('/')}
            else {req.flash('success','account unlinked');res.redirect('/profile');}
        });
    });

    //ALL ROUTES FOR TWITTER GOES HERE

    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect: '/profile',
        failureRedirect: '/',
        failureFlash: true
    }));

    app.get('/connect/twitter', passport.authorize('twitter'));

    app.get('/connect/twitter/callback', passport.authorize('twitter', {
        successRedirect: '/profile',
        failureRedirect: '/',
        failureFlash: true
    }));

    app.get('/unlink/twitter', function (req, res) {
        var user = req.user;
        user.twitter.token = undefined;
        user.save(function (err) {
            if(err){ req.flash('error',err.message); res.redirect('/') }
            else {req.flash('success','account unlinked :) ');res.redirect('/profile');}
        });
    });

    //All ROUTES FOR GOOGLE AUTH GOES HERE

    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

    app.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/',
        failureFlash: true
    }));

    app.get('/connect/google', passport.authorize('google', {scope: ['profile', 'email']}));

    app.get('/connect/google/callback', passport.authorize('google', {
        successRedirect: '/profile',
        failureRedirect: '/',
        failureFlash: true
    }));

    app.get('/unlink/google', function (req, res) {
        var user = req.user;
        user.google.token = undefined;
        user.save(function (err) {
            if(err){ req.flash('error',err.message); res.redirect('/') }
            else {req.flash('success','account unlinked :) ');res.redirect('/profile');}
        });
    });

    // ROUTES FOR POST GOES HERE

    app.get('/post/new',isLoggedIn, function (req, res) {
        res.render('createPost');
    });

    app.post('/post/new',isLoggedIn,upload.single('image'),function (req,res) {
        var po = {
            author : {
                displayName : req.user.displayName,
                displayPic : req.user.displayPic,
                id : req.user._id
            },
            createdOn : moment.utc().utcOffset(+330).format('DD MMM, YYYY'),
            about : req.body.about
        };
        Post.create(po,function (err,post) {
            if(err){req.flash('error',err.message);res.redirect('/')}
            if(req.file){
                cloudinary.uploader.upload(req.file.path,function (result) {
                    post.image = result.url;
                    post.save();
                    req.flash('success','Posted :)');
                    fs.unlink(req.file.path,function (err) {});
                    res.redirect('/');
                });
            }else {
                res.redirect('/');
            }
        })
    });

    app.put('/post/:id',checkPostAuth,upload.single('image'),function (req,res) {
        req.body.about.body = req.sanitize(req.body.about.body);
        Post.findById(req.params.id,function (err,post) {
            if(err){req.flash('error',err.message);res.redirect('/')}
            else {
                if(req.file){
                    cloudinary.uploader.upload(req.file.path,function (result) {
                        post.image = result.url;
                        post.about = req.body.about;
                        post.save();
                        req.flash('success','updated :)');
                        fs.unlink(req.file.path,function (err) {});
                        res.redirect('/post/'+req.params.id);
                    });
                }else {
                    post.about = req.body.about;
                    post.save();
                    req.flash('success','updates :)');
                    res.redirect('/post/'+req.params.id);
                }
            }
        })
    });


    app.get('/post/:id', function (req, res) {
        Post.findById(req.params.id).populate('comment').exec(function (err, thepost) {
            if (err) {
                req.flash('error', err.message);
                res.redirect('/');
            }
            else res.render('showPost', {post: thepost});
        });
    });

    app.get('/post/:id/edit', checkPostAuth, function (req, res) {
        Post.findById(req.params.id).exec(function (err, post) {
            res.render('editPost', {post: post})
        });
    });

    app.delete('/post/:id',checkPostAuth, function (req, res) {
        Post.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
                req.flash('error', err.message);
                res.redirect('/')
            }
            else {
                req.flash('success', 'Post deleted :)');
                res.redirect('/');
            }
        })
    });

    //ROUTES FOR COMMENT GOES HERE

    app.post('/post/:id/comment', isLoggedIn, function (req, res) {
        Post.findById(req.params.id, function (err, post) {
            if (err) {
                req.flash('error', err.message)
            }
            else {
                req.body.commentText.body = req.sanitize(req.body.commentText.body);
                Comment.create({},function (err, comment) {
                    if (err) {
                        req.flash('error', err.message);
                        res.redirect('/');
                    }
                    else {
                        comment.text = req.body.commentText;
                        comment.author.id = req.user._id;
                        comment.author.displayName = req.user.displayName;
                        comment.author.displayPic = req.user.displayPic;
                        comment.createdOn = moment.utc().utcOffset(+330).format('DD MMM, HH:mm');
                        comment.save();
                        post.comment.push(comment);
                        post.save();
                        req.flash('success', 'commented :)');
                        res.redirect('/post/' + req.params.id);
                    }
                });
            }
        });
    });

    app.get('/post/:id/comment/:commentId/edit', checkCommentAuth, function (req, res) {
        Comment.findById(req.params.commentId, function (err, comment) {
            res.render('commentEdit', {postId: req.params.id, comment: comment});
        });
    });
    
    app.put('/post/:id/comment/:commentId',checkCommentAuth,function (req,res) {
        req.body.commentText.body = req.sanitize(req.body.commentText.body);
        Comment.findByIdAndUpdate(req.params.commentId,{text : req.body.commentText},function (err,comment) {
            if(err) {req.flash('error',err.message);res.redirect('/');}
            else {
                req.flash('success','Comment Updated :)');
                res.redirect('/post/' + req.params.id);
            }
        });
    });
    
    app.delete('/post/:id/comment/:commentId',checkCommentAuth,function (req,res) {
        Comment.findByIdAndRemove(req.params.commentId,function (err) {
            if(err) {req.flash('error',err.message);res.redirect('/')}
            else {req.flash('success','Comment deleted :)');res.redirect('/post/' + req.params.id)}
        });
    });


};

//middleware

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    else {
        req.flash('error', 'Need to be logged in :)');
        res.redirect('/login');
    }

}

function checkPostAuth(req, res, next) {
    if (req.isAuthenticated()) {
        Post.findById(req.params.id).exec(function (err, post) {
            if (err) {
                req.flash('error', 'can\'t find in database :(');
                res.redirect('back');
            } else {
                if (post.author.id.equals(req.user._id)) next();
                else {
                    req.flash('error', 'permission denied :( ');
                    res.redirect('back');
                }
            }
        })
    } else {
        req.flash('error', 'you need to be logged-in :)');
        res.redirect('/login');
    }
}

function checkCommentAuth(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.commentId).exec(function (err, comment) {
            if (err) {
                req.flash('error', err.message);
                res.redirect('/');
            }
            else {
                if (comment.author.id.equals(req.user._id)) next();
                else {
                    req.flash('error', 'permission denied :(');
                    res.redirect('back');
                }
            }
        })
    } else {
        req.flash('error', 'you need to be logged in :)');
        res.redirect('/login');
    }
}

function checkProfileAuth(req, res, next) {
    if (req.isAuthenticated()) {
        User.findById(req.params.id).exec(function (err, user) {
            if (err) {
                req.flash('error', err.message);
                res.redirect('/');
            }
            else {
                if (user._id.equals(req.user._id)) next();
                else {
                    req.flash('error', 'permission denied :(');
                    res.redirect('back');
                }
            }
        })
    } else {
        req.flash('error', 'you need to be logged in :)');
        res.redirect('/login');
    }
}