const express = require('express') // uso require para importar express
const cors = require('cors') // USO CORS PARA PERMITIR ORIGEN CRUZADO
require('dotenv').config() // USO DOTENV PARA TENER VARIABLES DE ENTORNO
const router = require('./routes/index')// IMPORTO MIS RUTAS
require('./config/database')
require('./config/passport')
const path = require('path')
const app = express()  // creo una instancia de Express (createApplication())
const socket = require("socket.io");
const jwt = require('jsonwebtoken')
// dentro de app, vive el resultado de ejecutar el createApplication de express, me da un servidor listo para levantar
// FILTRO MIDDLEWARE, antes de usar mi aplicación, uso el filtro. Para que pueda responder de origen cruzado
app.use(cors())
app.use(express.json())


// verificar path de produccion
app.use('/api', router) // cuando haga cualquier pedido a la /api, ejecuto el router
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res)=>{
        res.sendFile(path.join(__dirname + "/client/build/index.html"))
    })
}
const PORT = process.env.PORT || 4000
const HOST = process.env.MYHOST || '0.0.0.0'
const serva = app.listen(PORT,HOST, () => console.log(`Server listening on ${PORT} at ${HOST}!`)) // que comienze a escuchar en puerto 4000, una vez escuchado ejecutar función
const io = socket(serva, {
    cors:{
      origin:'https://mardelcasas.herokuapp.com',
      credentials: true
    }
  });

// SOCKET IO MAGIC

let usersConnected = []
let adminsConnected = []
let didReset = false
io.on("connection", (socket) => {
    if(!didReset){
        console.log("mande a resetear")
        setTimeout(() => {
            console.log("resetió")
            io.sockets.emit("resetAll")
        }, 4000)
        didReset = true
    }
    let error = null
    let verifiedUser = null
    try{
        verifiedUser = jwt.verify(socket.handshake.auth.token, process.env.SECRETORKEY)
        // console.log(verifiedUser)
    }catch(err){
        error = err
    }
    if(error){
        console.log("Disconnected Socket BECAUSE ERROR")
        socket.disconnect()
    }
    if(verifiedUser._doc.admin){
        // console.log(socket.id)
        // console.log(verifiedUser._doc.admin)
        let newAdmin = {lastName: verifiedUser._doc.lastName, id: socket.id, eMail: verifiedUser._doc.eMail}
        adminsConnected.forEach(admin => {
            if(admin.eMail === newAdmin.eMail){
                io.sockets.sockets.forEach((socket) => {
                    // If given socket id is exist in list of all sockets, kill it
                    if(socket.id === admin.id){
                        socket.disconnect();
                    }     
                })
            }
        })
        adminsConnected = adminsConnected.filter(admin => newAdmin.eMail !== admin.eMail)
        adminsConnected.push(newAdmin)
        console.log("admin connected", newAdmin.eMail)
        usersConnected.forEach(user => socket.broadcast.to(user.id).emit('adminConnected', adminsConnected.length))
        socket.emit("userConnected", usersConnected)
    }else{
        // console.log(socket.id)
        // console.log(verifiedUser._doc.admin)
        
        let newUser = {eMail: verifiedUser._doc.eMail, id: socket.id, firstName: verifiedUser._doc.firstName}
        // console.log(newUser.eMail)
        usersConnected.forEach(user => {
            // console.log(newUser.eMail)
            // console.log(usersConnected)
            if(user.eMail === newUser.eMail){
                // console.log("entre")
                io.sockets.sockets.forEach((socket) => {
                    // console.log(socket.id)
                    // If given socket id is exist in list of all sockets, kill it
                    if(socket.id === user.id){
                        console.log("mande reset y disconnect")
                        socket.emit("resetAll")
                        socket.disconnect();
                    } 
                })
            }
        })
        usersConnected = usersConnected.filter(admin => newUser.eMail !== admin.eMail)
        usersConnected.push(newUser)
        console.log("User connected", newUser.eMail)
        adminsConnected.forEach(user => socket.broadcast.to(user.id).emit('userConnected', usersConnected))
        socket.emit("adminConnected", adminsConnected.length)
    }
    // console.log(io.sockets.sockets)
    socket.on("newMessageTo", (msgInfo) =>{
        // console.log(msgInfo)
        socket.broadcast.to(msgInfo.sendTo).emit("newMessage", {message: msgInfo.message, sender: socket.id})
    })
    socket.on("clientNeedHelp", () =>{
        console.log(socket.id)
        console.log("pedido de ayuda")
       adminsConnected.forEach(admin => socket.broadcast.to(admin.id).emit("clientNeedHelp", {sender: socket.id}))
    })
    socket.on("iWillHelp", (whoToHelp) =>{
        // console.log(whoToHelp)
        if(usersConnected.some(user => user.id === whoToHelp.whoToHelp)){
            socket.broadcast.to(whoToHelp.whoToHelp).emit("iWillHelpYou", {sender: socket.id})
        }
    })
    socket.on("disconnect", () =>{
        console.log(`${socket.id} disconnected`)
        if(verifiedUser._doc.admin){
            // console.log(socket.id)
            // console.log(verifiedUser._doc.admin)
            console.log("Admin disconnected")
            adminsConnected = adminsConnected.filter(admin => admin.id !== socket.id)
            usersConnected.forEach(user => socket.broadcast.to(user.id).emit('adminConnected', adminsConnected.length))
        }else{
            // console.log(socket.id)
            // console.log(verifiedUser._doc.admin)
            console.log("User disconnected")
            usersConnected = usersConnected.filter(user => user.id !== socket.id)
            adminsConnected.forEach(user => socket.broadcast.to(user.id).emit('userConnected', usersConnected))
        }
    })
})