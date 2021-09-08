const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy
const jwtExtract = require('passport-jwt').ExtractJwt
const User = require('../models/User')
// exporto passport utilizo middleware nueva instancia jwt strategy
// param 1 options, param 2 func callback
// el payload es lo que tiene luego de abrir mi caja encriptada
// done, se lo pasa al prox controlador
module.exports = passport.use(new jwtStrategy({
    jwtFromRequest: jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRETORKEY
}, (payload, done) =>{
    // console.log(payload)
    console.log("Received Passport petition:" + Date())
    User.findOne({_id: payload._doc._id})
    .then(user => {
        if(!user){
            return done(null, false) // si no hay user, null error y no user
        }else{
            // console.log(user)
            return done(null, user) // si hay user, null error y user
        }
    })
    .catch(err => done(err, false)) // hay error, no hay usuario
}))

