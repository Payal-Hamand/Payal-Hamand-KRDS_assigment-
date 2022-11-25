
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser((user , done) => {
    done(null , user);
})
passport.deserializeUser(function(user, done) {
    done(null, user);
});
  

  
passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_LOGIN_CLIENTID, 
    clientSecret:process.env.GOOGLE_LOGIN_SECETID, 
    callbackURL:"http://localhost:3000/auth/callback",
    passReqToCallback:true
  },
  function(request, accessToken, refreshToken, profile, done) {
    console.log("SUCCESS")
    return done(null, profile);
  }
));