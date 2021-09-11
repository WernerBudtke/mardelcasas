const express = require('express')
const passport = require('passport')
const validatorControllers = require('../controllers/validatorControllers')
const cityControllers = require('../controllers/cityControllers')
const userControllers = require('../controllers/userControllers')
const propertyControllers = require('../controllers/propertyControllers')
const agentControllers = require('../controllers/agentControllers')

const router = express.Router()

// USERS ROUTES
router.route('/users') // BORRAR ANTES DE DEPLOY
// .get(userControllers.getAllUsers)
router.route('/user/register')
.post(
    validatorControllers.validatorSignUp,
    userControllers.registerUser
)
router.route('/user/login')
.post(userControllers.logUser)
router.route('/user/validate')
.get(
    passport.authenticate('jwt', {session: false}),
    // userControllers.isValidUser
)
router.route('/user/wishlist')
.get(
    passport.authenticate('jwt', {session: false}),
    // userControllers.getWishList
)
router.route('/user/validatemail') // revisar
.get(
    passport.authenticate('jwt', {session: false}),
    userControllers.sendValidationMail
)
.post(
    validatorControllers.validatorPasswordResetEmailSend,
    userControllers.sendValidationMailByMail
)
router.route('/user/validatemail/:id') // revisar
.get(userControllers.validateUser)
router.route('/user/resetpassword')
.post(
    // validatorControllers.validatorPasswordResetEmailSend,
    userControllers.sendResetPasswordMail
)
router.route('/user/resetpassword/:id')
.put(
    validatorControllers.validatorPasswordChange,
    userControllers.resetUserPassword
)
router.route('/user/compromised/:id')
.get(userControllers.disableUser)
router.route('/user/managefilter')
.put(
    passport.authenticate('jwt', {session: false}),
    userControllers.manageDreamHouseOfUser
)
// USER ROUTES LIKE PROP, TRAER FAV PROPS
router.route('/user/like/:id')
.get(
    passport.authenticate('jwt', {session: false}), 
    userControllers.updateLikedProperties
)
router.route('/user/favourites')
.get(
    passport.authenticate('jwt', {session: false}),
    userControllers.populateProperties
)
// USER ROUTES ADMIN / SUPPORT POWERS
router.route('/user/manageuser')
.put(
    passport.authenticate('jwt', {session:false}),
    userControllers.manageUser
)
// CITY ROUTES
router.route('/cities')
.get(cityControllers.getAllCities)
router.route('/city/:id')
.get(cityControllers.getACity)
router.route('/city')
.post(
    passport.authenticate('jwt', {session: false}),
    cityControllers.postACity
)
.put(
    passport.authenticate('jwt', {session: false}),
    cityControllers.modifyACity
)
.delete(
    passport.authenticate('jwt', {session: false}),
    cityControllers.removeACity
)

// AGENT ROUTES
router.route('/agents')
.get(agentControllers.getAllAgents)
router.route('/agent')
.get(agentControllers.getAnAgent)
.post(
    passport.authenticate('jwt', {session: false}),
    agentControllers.addAnAgent
)
.put(
    passport.authenticate('jwt', {session: false}),
    agentControllers.modifyAnAgent
)
.delete(
    passport.authenticate('jwt', {session: false}),
    agentControllers.removeAnAgent
)

// PROPERTY ROUTES
router.route('/property/:id')
.get(propertyControllers.getAProperty)
router.route('/properties')
.put(propertyControllers.getProperties)
router.route('/property')
.post(
    passport.authenticate('jwt', {session: false}),
    propertyControllers.addAProperty
)
.put(
    passport.authenticate('jwt', {session: false}),
    propertyControllers.modifyAProperty
)
.delete(
    passport.authenticate('jwt', {session: false}),
    propertyControllers.removeAProperty
)
router.route('/updatemanyproperties')
.put(
    passport.authenticate('jwt', {session: false}),
    propertyControllers.updateManyProps
)
router.route('/getnumberofprops/:id')
.get(propertyControllers.getNumberOfProps)

module.exports = router