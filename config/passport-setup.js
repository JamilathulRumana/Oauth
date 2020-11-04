const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const keys=require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});


passport.use(
    new GoogleStrategy({
        // options for google strategy
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our own db
        User.findOne({googleId: profile.id}).then((currentUser) => {
            if(currentUser){
                // already have this user
                console.log('user is: ', currentUser);
                done(null, currentUser);
                // do something
            } else {
                // if not, create user in our db
                new User({
                    googleId: profile.id,
                    username: profile.displayName,
                    thumbnail: profile._json.picture.url
                }).save().then((newUser) => {
                    console.log('created new user: ', newUser);
                    done(null, newUser);
                    // do something
                });
            }
        });
    })
);





// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://due_user_01:<password>@duecluster01.xykxm.mongodb.net/<dbname>?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

//mongodb+srv://due_user_01:<password>@duecluster01.xykxm.mongodb.net/<dbname>?retryWrites=true&w=majority



//ClientID: 593870450092-snvf0gc189m1qq9ce5069rns5ietv17v.apps.googleusercontent.com
//ClientSecret: H0ozyoh2Zm32YM3MJ2v_BaP0