const User = require('../models/User')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
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

const userControllers = {
    registerUser: (req, res) =>{
        console.log("Received Register User Petition:" + Date())
        const {firstName, lastName, password, eMail, photoURL, google, facebook} = req.body
        let hashedPass = bcryptjs.hashSync(password)
        const newUser = new User({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            password : hashedPass,
            eMail: eMail.trim(),
            photoURL: photoURL.trim(),
            google,
            facebook,
        })
        newUser.save()
        .then(user => {
            const token = jwt.sign({...newUser}, process.env.SECRETORKEY)
            res.json({success: true, response: {photoURL: user.photoURL, firstName: user.firstName, lastName: user.lastName, eMail: user.eMail, token: token, admin: false}}) // desde front, tomar token y pegarle al validar mail
        })
        .catch(err => {
            res.json({success: false, response: err.message.includes('duplicate key') ? 'el mail ya esta en uso' : err.message})
        })
    },
    logUser: (req, res)=>{
        console.log("Received SIGN IN USER Petition:" + Date())
        const errMessage = "Usuario o contrasena invalida"
        const {eMail, password, google, facebook} = req.body
        User.exists({eMail: eMail}).then(exists => {
            if(exists){
                User.findOne({eMail: eMail})
                .then(userFound => {
                    if((userFound.google === true && google === false) || (userFound.facebook === true && facebook === false)){
                        throw new Error(`Ingrese con ${userFound.google ? 'Google' : 'Facebook'}!`)
                    }
                    if(!userFound.validated){
                        throw new Error(`Por favor valide su cuenta, revise su email`) // que en front end al recibir este error, de opcion de enviar mail de nuevo.
                    }
                    if(userFound.banned){
                        throw new Error('Este usuario tiene un ban')
                    }
                    if(!bcryptjs.compareSync(password, userFound.password))throw new Error(errMessage)
                    const token = jwt.sign({...userFound}, process.env.SECRETORKEY) 
                    res.json({success: true, response: {photoURL: userFound.photoURL, firstName: userFound.firstName, lastName: userFound.lastName, eMail: userFound.eMail, token: token, admin: userFound.admin, likedProperties: userFound.likedProperties, userId: userFound._id}})
                })
                .catch(err => handleError(res, err))
            }else{
                throw new Error(errMessage)
            } 
        })
        .catch(err => handleError(res, err))   
    },
    sendValidationMail: (req, res)=>{
        console.log("Received Send Validation Mail Petition:" + Date())
        let message = `
            <header style="text-align:center;color:black;">
                <h1 style="font-size:30px;text-decoration:underline;">MarDelCasas</h1>
                <h2>¡Hola ${req.user.firstName} ${req.user.lastName}!</h2>
            </header>
            <main style="text-align:center;margin-bottom:20px;">
                <p style="color:black;font-size:20px;text-align:center;">Por favor para confirmar su cuenta haga click en el siguiente link:</p>
                <a href="https://mardelcasas.herokuapp.com/usuario/validar-email/${req.user._id}" style="font-size:25px;text-align:center;display:block;">CLICK AQUI!</a>
            </main>
            <footer style="text-align:center;">
                <p>MarDeLasCasas SRL</p>
                <p>Dir: Jujuy 995, Mar del Plata, Buenos Aires</p>
                <p>Telefono: +54 2235391098</p>
                <p style="color:red;">+ INFO!: <span style="color:blue;">mardelcasas@gmail.com</span></p>
                <img src="cid:marDelCasasLogo@mardelcasas.com" style="width:150px;heigth:150px;"/>
            </footer>
            
        `//reemplazar esta URL por una de frontend, que vaya en params un ID, que en front monte componente y useEffect did mount, haga pedido a esa ruta de api con el req params id
        let mailOptions = {
            from: "Mar Del Casas <mardelcasas@gmail.com>",
            to: `${req.user.firstName} <${req.user.eMail}>`,
            subject: `Bienvenido ${req.user.firstName}!`,
            text: message,
            html: message,
            attachments: [{   
                filename: "MARDELCASAS-L.png",
                path: __dirname+"/MARDELCASAS-L.png", 
                cid: "marDelCasasLogo@mardelcasas.com"
            }],
        }
        transporter.sendMail(mailOptions, (err, data) => {
            err ? res.json({success: false, response: err}) : res.json({success: true, response: data})
        })
    },
    validateUser: (req, res)=>{
        console.log(req.params.id)
        console.log("Received Validate User Email Petition:" + Date())
        User.findOneAndUpdate({_id: req.params.id}, {validated: true})
        .then(user => user ? res.json({success: true}) : res.json({success: false, response: "Didn't find that user"}))
        .catch(err => handleError(res, err))
    },
    sendValidationMailByMail: (req, res)=>{
        console.log("Received Validate User send Mail Again by input Email Petition:" + Date())
        const {eMail} = req.body
        User.findOne({eMail: eMail})
        .then(user =>{
            if(!user){
                throw new Error ("Usuario no encontrado")
            }
            if(user.validated){
                throw new Error ("Usuario ya validado")
            }
            let message = `
                <header style="text-align:center;color:black;">
                    <h1 style="font-size:30px;text-decoration:underline;">MarDelCasas</h1>
                    <h2>¡Hola ${user.firstName} ${user.lastName}!</h2>
                </header>
                <main style="text-align:center;margin-bottom:20px;">
                    <p style="color:black;font-size:20px;text-align:center;">Por favor para confirmar tu cuenta sigue a:</p>
                    <a href="https://mardelcasas.herokuapp.com/usuario/validar-email/${user._id}" style="font-size:25px;text-align:center;display:block;">CLICK AQUI!</a>
                </main>
                <footer style="text-align:center;">
                    <p>MarDeLasCasas SRL</p>
                    <p>Dir: Jujuy 995, Mar del Plata, Buenos Aires</p>
                    <p>Telefono: +54 2235391098</p>
                    <p style="color:red;">+ INFO!: <span style="color:blue;">mardelcasas@gmail.com</span></p>
                    <img src="cid:marDelCasasLogo@mardelcasas.com" style="width:150px;heigth:150px;"/>
                </footer>
            `//reemplazar esta URL por una de frontend, que vaya en params un ID, que en front monte componente y useEffect did mount, haga pedido a esa ruta de api con el req params id
            let mailOptions = {
                from: "Mar Del Casas <mardelcasas@gmail.com>",
                to: `${user.firstName} <${user.eMail}>`,
                subject: `Hola ${user.firstName}!`,
                text: message,
                html: message,
                attachments: [{  
                    filename: "MARDELCASAS-L.png",
                    path: __dirname+"/MARDELCASAS-L.png",
                    cid: "marDelCasasLogo@mardelcasas.com"
                }],
            }
            transporter.sendMail(mailOptions, (err, data) => {
                err ? res.json({success: false, response: err}) : res.json({success: true, response: data})
            })
        })
        .catch(err => handleError(res, err))
    },
    sendResetPasswordMail: (req, res) =>{
        // console.log(req)
        console.log("Received Send Reset Password Mail Petition:" + Date())
        const {eMail} = req.body
        User.findOne({eMail: eMail})
        .then(user => {
            if(user){
                if(!user.validated){
                    throw new Error("Debes validar ese usuario primero")
                }
                let message = `
                    <header style="text-align:center;color:black;">
                        <h1 style="font-size:30px;text-decoration:underline;">MarDelCasas</h1>
                        <h2>¡Hola ${user.firstName} ${user.lastName}!</h2>
                    </header>
                    <main style="text-align:center;margin-bottom:20px;">
                        <p style="color:black;font-size:20px;text-align:center;">Por favor cambie su contraseña en este link:</p>
                        <a href="https://mardelcasas.herokuapp.com/usuario/restablecer-contraseña/${user._id}" style="font-size:25px;text-align:center;display:block;">CLICK AQUI!</a>
                    </main>
                    <footer style="text-align:center;">
                        <p>MarDeLasCasas SRL</p>
                        <p>Dir: Jujuy 995, Mar del Plata, Buenos Aires</p>
                        <p>Telefono: +54 2235391098</p>
                        <p style="color:red;">+ INFO!: <span style="color:blue;">mardelcasas@gmail.com</span></p>
                        <img src="cid:marDelCasasLogo@mardelcasas.com" style="width:150px;heigth:150px;"/>
                    </footer>
                `//mandarlo a frontend a una pagina con 2 input para la contraseña y que cuando el tipo toque enviar le pegues a ese endpoint, con ese params id y el paquete en el body
                let mailOptions = {
                    from: "Mar Del Casas <mardelcasas@gmail.com>",
                    to: `${user.firstName} <${user.eMail}>`,
                    subject: `Cambio de contrasena ${user.firstName}!`,
                    text: message,
                    html: message,
                    attachments: [{   
                        filename: "MARDELCASAS-L.png",
                        path: __dirname+"/MARDELCASAS-L.png",
                        cid: "marDelCasasLogo@mardelcasas.com"
                    }],
                }
                transporter.sendMail(mailOptions, (err, data) => {
                    err ? res.json({success: false, response: err}) : res.json({success: true, response: data})
                })
            }else{
                throw new Error("No se encontró ese usuario")
            }
        })
        .catch( err => handleError(res, err))
    },
    resetUserPassword: (req, res)=>{ // desde el punto de vista de la inseguridad... es medio inseguro esto, ver como hacer.
        console.log("Received Reset Password Petition:" + Date())
        const {password} = req.body
        let hashedPass = bcryptjs.hashSync(password)
        User.findOneAndUpdate({_id: req.params.id}, {password: hashedPass})
        .then(user => {
            if(user){
                let message = `
                    <header style="text-align:center;color:black;">
                        <h1 style="font-size:30px;text-decoration:underline;">MarDelCasas</h1>
                        <h2>¡Hola ${user.firstName} ${user.lastName}!</h2>
                    </header>
                    <main style="text-align:center;margin-bottom:20px;">
                        <p style="color:black;font-size:20px;text-align:center;">Queremos informarte que tu contrasena fue reiniciada!</p>
                        <p style="color:black;font-size:20px;text-align:center;">Si no fuiste tu quien cambio tu contrasena, y quieres deshabilitar tu cuenta, por favor sigue al siguiente link:</p>
                        <a href="https://mardelcasas.herokuapp.com/usuario/confirmacion-deshabilitar-cuenta/${user._id}" style="font-size:25px;text-align:center;display:block;">No fui yo quien reinicio la contrasena, ayuda!</a>
                    </main>
                    <footer style="text-align:center;">
                        <p>MarDeLasCasas SRL</p>
                        <p>Dir: Jujuy 995, Mar del Plata, Buenos Aires</p>
                        <p>Telefono: +54 2235391098</p>
                        <p style="color:red;">+ INFO!: <span style="color:blue;">mardelcasas@gmail.com</span></p>
                        <img src="cid:marDelCasasLogo@mardelcasas.com" style="width:150px;heigth:150px;"/>
                    </footer>
                `//mandarlo a frontend a una pagina de datos de contacto con una confirmación si quiere desabilitar su cuenta!
                let mailOptions = {
                    from: "Mar Del Casas <mardelcasas@gmail.com>",
                    to: `${user.firstName} <${user.eMail}>`,
                    subject: `Tu contrasena cambio ${user.firstName}!`,
                    text: message,
                    html: message,
                    attachments: [{  
                        filename: "MARDELCASAS-L.png",
                        path: __dirname+"/MARDELCASAS-L.png", 
                        cid: "marDelCasasLogo@mardelcasas.com"
                    }],
                }
                transporter.sendMail(mailOptions, (err, data) => {
                    err ? res.json({success: true, response: 'contrasena cambiada pero email fallo'}) : res.json({success: true, response: 'contrasena cambiada y email enviado'})
                })
            }else{
                throw new Error('No se encontro el usuario')
            }
        })
        .catch((err) => handleError(res, err))
    }, // mandarle mail al usuario que hubo cambios en su cuenta, opcion de bannear cuenta. redirigir a un componente con datos de contacto.
    disableUser: (req, res)=>{
        console.log("Received Disable User because Compromised Petition:" + Date())
        User.findOneAndUpdate({_id: req.params.id}, {banned: true})
        .then(user => user ? res.json({success: true, response: {response: 'usuario bloqueado satisfactoriamente', userName: user.firstName, userEmail: user.eMail }}) : res.json({success: false, response: 'usuario no encontrado'}))
        .catch(err => handleError(res, err))
    },
    manageUser: (req, res)=>{ // posible future feature, send mail for BANNED users only, consider appealing at help component
        console.log("Received Manage User Petition:" + Date())
        if(req.user.admin){
            let whatToDo = req.body.actionToDo === 'ban'
            User.findOneAndUpdate({_id: req.body._id}, {banned: whatToDo})
            .then(user => user ? res.json({success: true, response: `Usuario ${whatToDo ? 'banneado' : 'desbaneado'} satisfactoriamente`}) : res.json({success: false, response: 'usuario no encontrado'}))
            .catch(err => handleError(res, err))
        }else{
            res.json({success: false, response: "No tienes permisos para hacer esto"})
        }
    },
    manageDreamHouseOfUser: (req, res)=>{
        console.log("Received Manage Filter AND Email List Petition:" + Date())
        let whatToDo = req.body.actionToDo === 'add'
        User.findOneAndUpdate({_id: req.user._id}, {suscribedToNewsLetter: whatToDo && true})
        .then(user => user ? res.json({success: true, response: `new property ${whatToDo ? 'added to' : 'removed from'} user`}) : res.json({success: false, response: 'user not found'}))
        .catch(err => handleError(res, err))
    },
    populateProperties: (req, res)=>{
        console.log("Received Populate Favourites Properties Petition:" + Date())
        User.findOne({ _id: req.user._id }).populate({
          path: 'likedProperties',
          populate: { path: 'city' }
        }).then(response => res.json({success: true, response: response.likedProperties}))
        .catch(err => handleError(res, err))
    },
    updateLikedProperties: (req, res) =>{
        console.log("Received Like A Property Petition:" + Date())
        let foundProperty =  req.user.likedProperties.indexOf(req.params.id)
        User.findOneAndUpdate({_id: req.user._id}, { [`$${foundProperty !== -1 ? 'pull' : 'push'}`]: { likedProperties: req.params.id } }, {new:true})
        .then(modifiedUser => {
            res.json({success: true, response: modifiedUser.likedProperties})
        }).catch(err => handleError(res, err))
    },
}

module.exports = userControllers