const Property = require('../models/Property')
const User = require('../models/User')
const nodemailer = require('nodemailer')
const handleError = (res,err) =>{
    console.log(err.message)
    res.json({success: false, response: err.message})
}
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    type: 'OAuth2',
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
})
const propertyControllers = {
    getProperties: (req, res) => {
        // necesito que me manden de frontend todos los filtros dentro de body en {filter:{filtros...}} OJO dentro de filtros tener greater and lower
        console.log("Received Get Properties Petition:" + Date())
        if (req.body.filter){
            if (Object.keys(req.body.filter).length === 0){
                Property.find()
                .then(properties => res.json({success: true, response: properties }))
                .catch(err => handleError(res,err))
            }else{
                Property.find({...req.body.filter, price: {$gte: req.body.filter.greater || 0, $lte: req.body.filter.lower || Number.MAX_VALUE}})
                .then(properties => res.json({success: true, response: properties }))
                .catch(err => handleError(res, err))
            }     
        }else{
            res.json({sucess: false, response: "Body can't be blank, have to put something"})
        }   
    },
    getAProperty: (req, res) => {
        console.log("Received Get Property Petition:" + Date())
        Property.findOne({_id: req.params.id})
        .then(property => res.json({success: true, response: property}))
        .catch(err => handleError(res,err))
    },
    addAProperty: (req, res) => { 
        console.log("Received Post Property Petition:" + Date())
        if(req.user.admin){
            const newProperty = new Property({...req.body})
            const {isBrandNew, isHouse, forSale, haveGarden, haveGarage, havePool, numberOfBathrooms, numberOfBedrooms, numberOfRooms, roofedArea, totalArea, price} = req.body
            const whatToSearchFor = {
                isBrandNew,
                isHouse,
                forSale,
                haveGarden,
                haveGarage,
                havePool,
                numberOfBathrooms,
                numberOfBedrooms,
                numberOfRooms
            } // hay que acordar QUE COSAS se guardan en el filtro del usuario cuando se agrega al usuario, para buscar ACA
            // console.log(whatToSearchFor)
            newProperty.save()
            .then((property) => {
                User.find({dreamProperty: whatToSearchFor, suscribedToNewsLetter: true})
                .then(async users => {
                    if(users.length > 0){
                        let emailsAccepted = []
                        let emailsRejected = []
                        for ( const user of users){
                            let message = `
                            <h1>Hello ${user.firstName} ${user.lastName}</h1>
                            <p>We would like to inform you that your dreamed house is on our page now:</p>
                            <break></break>
                            <a href="https://mardelcasas.herokuapp.com/house/${property._id}">CLICK HERE!</a>
                            `//reemplazar esta URL por una de frontend, que vaya en params un ID, que en front monte componente y useEffect did mount, haga pedido a esa ruta de api con el req params id
                            let mailOptions = {
                                from: "Mar Del Casas <mardelcasas@gmail.com>",
                                to: `${user.firstName} <${user.eMail}>`,
                                subject: `Your dreamed house ${user.firstName}!`,
                                text: message,
                                html: message
                            }
                            try{
                                let response = await transporter.sendMail(mailOptions)
                                if(response.accepted){
                                    emailsAccepted.push(response.accepted[0])
                                }else{
                                    emailsRejected.push(response.rejected[0])
                                }
                            }catch(err){
                                throw new Error("wasn't able to send emails")
                            }
                        }                     
                        res.json({success: true, response: `Added house and Sent mail to: ${emailsAccepted.join(', ')} Rejected: ${emailsRejected.length > 0 ? emailsRejected.join(', ') : 0}`})
                    }else{
                        res.json({success: true, response: "Added house but didn't find any user to send mail"})
                    }
                })
                .catch(err => handleError(res, err))
            })
            .catch(err => handleError(res,err))
        }else{
            res.json({success: false, response: "You don't have permissions"})
        }   
    },
    removeAProperty: (req, res) => {
        console.log("Received Remove Property Petition:" + Date())
        if(req.user.admin){
            Property.findOneAndDelete({_id: req.body._id})
            .then(property => {
                property ? res.json({success: true, response: property}) : res.json({success: false, response: "no property found"})
            })
            .catch(err => handleError(res,err))
        }else{
            res.json({success: false, response: "You don't have permissions"})
        }
    },
    modifyAProperty: (req, res) => {
        console.log("Received Modify Property Petition:" + Date())
        if(req.user.admin){
            Property.findOneAndUpdate({_id: req.body._id}, {...req.body}, {new:true})
            .then(property => {
                property ? res.json({success: true, response: property}) : res.json({success: false, response: "no property found"})
            })
            .catch(err => handleError(res,err))
        }else{
            res.json({success: false, response: "You don't have permissions"})
        }
    },
    updateManyProps: (req, res) => {
        console.log("Received Update Many Properties Petition:" + Date())
        Property.updateMany({}, {...req.body})
        .then(() => res.json({success: true, response: "updated all properties"}))
        .catch(err => res.json({success: false, response: err}))
    },
    getNumberOfProps: (req, res) => {
        console.log("Received Get Number Of Properties Petition:" + Date())
        Property.countDocuments({city:req.params.id})
        .then(number => res.json({success: true, response: number}))
        .catch(err => handleError(res, err))
    }

}
module.exports = propertyControllers