const Property = require('../models/Property')
const User = require('../models/User')
const nodemailer = require('nodemailer')
const handleError = (res,err) =>{
    console.log(err.message)
    res.json({success: false, response: err.message})
}
let transporter = nodemailer.createTransport({
    port: 465,
    host:'smtp.gmail.com',
    auth:{
        user: process.env.MAILUSERNAME,
        pass: process.env.MAILPASSWORD
    },
    tls: {rejectUnauthorized: false}
})
const propertyControllers = {
    getProperties: (req, res) => {
        // necesito que me manden de frontend todos los filtros dentro de body en {filter:{filtros...}} OJO dentro de filtros tener greater and lower
        console.log("Received Get Properties Petition:" + Date())
        if (req.body.filter){
            if (Object.keys(req.body.filter).length === 0){
                Property.find()
                .populate({path: "city", select: "cityName"})
                .then(properties => res.json({success: true, response: properties }))
                .catch(err => handleError(res,err))
            }else{
                Property.find({...req.body.filter, price: {$gte: req.body.filter.greater || 0, $lte: req.body.filter.lower || Number.MAX_VALUE}})
                .populate({path: "city", select: "cityName"})
                .then(properties => res.json({success: true, response: properties }))
                .catch(err => handleError(res, err))
            }     
        }else{
            res.json({sucess: false, response: "El body no puede llegar vacio"})
        }   
    },
    getAProperty: (req, res) => {
        console.log("Received Get Property Petition:" + Date())
        Property.findOne({_id: req.params.id})
        .populate({path: "city", select: "cityName"})
        .then(property => res.json({success: true, response: property}))
        .catch(err => handleError(res,err))
    },
    addAProperty: (req, res) => { 
        console.log("Received Post Property Petition:" + Date())
        if(req.user.admin){
            const newProperty = new Property({...req.body})
            newProperty.save()
            .then((property) => {
                User.find({suscribedToNewsLetter: true})
                .then(async users => {
                    if(users.length > 0){
                        let emailsAccepted = []
                        let emailsRejected = []
                        for ( const user of users){
                            let message = `
                            <header style="text-align:center;color:black;">
                                <h1 style="font-size:30px;text-decoration:underline;">MarDelCasas</h1>
                                <h2>¡Hola ${user.firstName} ${user.lastName}!</h2>
                            </header>
                            <main style="text-align:center;margin-bottom:20px;">
                                <p style="color:black;font-size:20px;text-align:center;">Queremos informarte que se han cargado una nueva propiedad en MarDelCasas:</p>
                                <a href="https://mardelcasas.herokuapp.com/propiedad/${property._id}" style="font-size:25px;text-align:center;display:block;">CLICK AQUI!</a>
                            </main>
                            <footer style="text-align:center;">
                                <p>MarDeLasCasas SRL</p>
                                <p>Dir: Jujuy 995, Mar del Plata, Buenos Aires</p>
                                <p>Telefono: +54 2235391098</p>
                                <p style="color:red;">+ INFO!: <span style="color:blue;">mardelcasas@gmail.com</span></p>
                            </footer>
                            `//reemplazar esta URL por una de frontend, que vaya en params un ID, que en front monte componente y useEffect did mount, haga pedido a esa ruta de api con el req params id
                            let mailOptions = {
                                from: "Mar Del Casas <mardelcasas@gmail.com>",
                                to: `${user.firstName} <${user.eMail}>`,
                                subject: `Tu casa de ensueño ${user.firstName}!`,
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
                                throw new Error("no se pudo mandar mails")
                            }
                        }                     
                        res.json({success: true, response: `Casa agregada y mail enviado a: ${emailsAccepted.join(', ')} Rechazados: ${emailsRejected.length > 0 ? emailsRejected.join(', ') : 0}`})
                    }else{
                        res.json({success: true, response: "Agregada la casa pero no se encontro usuario al cual se pudiera mandar mail"})
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
                property ? res.json({success: true, response: property}) : res.json({success: false, response: "no se encontro la propiedad"})
            })
            .catch(err => handleError(res,err))
        }else{
            res.json({success: false, response: "No tienes permisos"})
        }
    },
    modifyAProperty: (req, res) => {
        console.log("Received Modify Property Petition:" + Date())
        if(req.user.admin){
            Property.findOneAndUpdate({_id: req.body._id}, {...req.body}, {new:true})
            .then(property => {
                property ? res.json({success: true, response: property}) : res.json({success: false, response: "no se encontro la propiedad"})
            })
            .catch(err => handleError(res,err))
        }else{
            res.json({success: false, response: "No tienes permisos"})
        }
    },
    updateManyProps: (req, res) => {
        console.log("Received Update Many Properties Petition:" + Date())
        Property.updateMany({}, {...req.body})
        .then(() => res.json({success: true, response: "actualizadas todas las propiedades"}))
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