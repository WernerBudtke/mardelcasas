const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy
const jwtExtract = require('passport-jwt').ExtractJwt
const User = require('../models/User')
module.exports = passport.use(new jwtStrategy({
    jwtFromRequest: jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRETORKEY
}, (payload, done) =>{
    console.log("Received Passport petition:" + Date())
    User.findOne({_id: payload._doc._id})
    .then(user => {
        if(!user){
            return done(null, false) 
        }else{
            return done(null, user)
        }
    })
    .catch(err => done(err, false))
}))

