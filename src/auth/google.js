const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth2');
const config = require("../../config.json")
// ... Model
const User = require('../models/user-model');


passport.use(
	new GoogleStrategy({
	    clientID: config.GOOGLE_LOGIN_CLIENT_ID,
		clientSecret: config.GOOGLE_LOGIN_SECRET_ID,
		callbackURL: config.GOOGLE_LOGIN_CALLBACK_URL
	},
	((accessToken, refreshToken, profile, done) => {
        const data = profile;

        User.findOrCreate({
            'googleId': data.id
        },
        {
            name: data.given_name,
            surname: data.family_name,
            profilePhotoUrl: data.picture
        },(err, user) => {
            return done(err, user);
        });
	})
));

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});



module.exports = passport;


