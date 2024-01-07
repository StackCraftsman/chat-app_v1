// jshint esversion:
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

export const auth_passport = passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:8000/api/v1/user/auth/google-redirect",
  },
  function(accessToken, refreshToken, profile, cb) {
    const firstName = profile.name.givenName;
    const lastName = profile.name.familyName;
    const id = profile.id;

    return cb(firstName, lastName);
  }
  ));


app.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }));

app.get("/auth/google/secrets", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
  res.redirect("/secrets");
});


app.get("/secrets", (req, res) => {
  
});


