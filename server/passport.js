"use strict"

var GitHubStrategy = require("passport-github").Strategy;
var User = require("./users.js");

module.exports = function(passport) {
    
    passport.serializeUser(function(user, done) {
       done(null, user.id); 
    });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    passport.use(new GitHubStrategy({
        clientID: "45bb536449af4e52eec6",
        clientSecret: "661f536b502cee326bec5acf353cef2ed4536233",
        callbackUrl: "https://voting-polling-app.herokuapp.com/" + "auth/github/callback"
    },
    function(token, refreshToken, profile, done) {
        process.nextTick(function() {
           User.findOne({ "github.id": profile.id }, function(err, user) {
              if (err) {
                return done(err);
              } 
              if (user) {
                return done(null, user);
              } else {
                var newUser = new User();
                
                newUser.github.id = profile.id;
                newUser.github.username = profile.username;
                newUser.github.displayName = profile.displayName;
                newUser.github.publicRepos = profile._json.public_repos;
                newUser.voted = [];
                  
                newUser.save(function(err) {
                    if (err) { throw err; }
                    console.log(newUser);
                    return done(null, newUser);
                });
              }
           });
        });
    }));
};