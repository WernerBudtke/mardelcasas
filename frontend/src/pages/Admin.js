import { connect } from "react-redux"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"
const Admin = (props) =>{
    const {token, admin} = props
    const [socket, setSocket] = useState(null)
    const [messages, setMessages] = useState([])
    useEffect(()=>{
        setSocket(io('http://localhost:4000', {
            auth:{
                token: token
            }
        }))
     //eslint-disable-next-line
    },[])
    useEffect(()=>{
        if(!token){
            return false
        }
        if(!socket){
            return false
        }
        socket.on("userConnected", (users) =>{
            console.log(users)
        })
        socket.on("newClientMessage", (packedMessage) =>{
            console.log(packedMessage)
        })
        socket.on("clientNeedHelp", who =>{
            console.log(who)
        })
        socket.on("newMessage", (message) =>{
            console.log(message)
            console.log(messages)
            setMessages(messages => [...messages, {message: message.message, sender: `User`}])
        })
    },[socket])
    const [newMessage, setNewMessage] = useState({
        message: '',
        sendTo: ''
    })
    const inputHandler = (e) => {
        setNewMessage({
            ...newMessage,
            [e.target.name] : e.target.value
        })
    }
    const sendMessage = () => {
        if(newMessage.message === ''){
            return false
        }
        socket.emit("newMessageTo", newMessage)
        setMessages(messages => [...messages, {message: newMessage.message, sender: 'Me'}])
        setNewMessage({
            ...newMessage,
            message: ''
        })
    }
    const [willHelp, setWillHelp] = useState({
        whoToHelp: ''
    })
    const inputHelpHandler = (e) =>{
        setWillHelp({
            [e.target.name] : e.target.value
        })
    }
    const sendIHelp = () =>{
        if(willHelp.whoToHelp === ''){
            return false
        }
        socket.emit('iWillHelp', willHelp)
        setNewMessage({
            ...newMessage,
            sendTo: willHelp.whoToHelp
        })
    }
    if(!token && !admin){
        return(
            <p>NO ESTAS AUTORIZADO A VER ESTO</p>
        )
    }
    return(
        <div>
            <h4>Chat de Soporte ADMIN VERSION</h4>
            <div className="chatBox">
                {messages.map((message, index) => <p key={index}>{message.sender === "Me" ? 'Me: ' : 'User: '}{message.message}</p>)}
            </div>
            <input onChange={inputHandler} type="text" name="message" value={newMessage.message}></input>
            <input onChange={inputHandler} type="text" name="sendTo" value={newMessage.sendTo}></input>
            <button onClick={sendMessage}>SEND</button>
            <input onChange={inputHelpHandler} type="text" name="whoToHelp" value= {willHelp.whoToHelp}></input>
            <button onClick={sendIHelp}>HELP HIM</button>
        </div>
    )
}
const mapStateToProps = (state) =>{
    return {
        token: state.user.token,
        admin: state.user.admin
    }
}
const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(Admin)