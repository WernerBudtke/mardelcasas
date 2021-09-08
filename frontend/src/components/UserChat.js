import { connect } from "react-redux"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"
const UserChat = (props) =>{
    const {token} = props
    const [socket, setSocket] = useState(null)
    const [adminsOnline, setAdminsOnline] = useState(0)
    useEffect(()=>{
        if(!token){
            return false
        }
        setSocket(io('http://localhost:4000', {
            auth:{
                token: token
            }
        }))
     //eslint-disable-next-line
    },[token])
    const [gotHelp, setGotHelp] = useState(false)
    const [whoIsHelpingMe, setWhoIsHelpingMe] = useState('')
    const [messages, setMessages] = useState([])
    useEffect(()=>{
        if(!token){
            return false
        }
        if(!socket){
            return false
        }
        socket.on('adminConnected', (admins) =>{
            setAdminsOnline(admins)
        })
        socket.on("newAdminMessage", (packedMessage) =>{
            console.log(packedMessage)
        })
        socket.on("iWillHelpYou", (adminInfo) =>{
            console.log(adminInfo)
            setWhoIsHelpingMe(adminInfo.sender)
            setGotHelp(true)
        })
        socket.on("newMessage", (message) =>{
            console.log(message)
            console.log("Cuando me llega el mensaje del admin", messages)
            setMessages(messages => [...messages, message])
            console.log("Despues de pushearlo", messages)
        })
    },[socket])
    const [newMessage, setNewMessage] = useState("")
    const inputHandler = (e) => {
        setNewMessage(e.target.value)
    }
    const sendMessage = () => {
        if(newMessage === ''){
            return false
        }
        socket.emit('newMessageTo', {message: newMessage, sendTo: whoIsHelpingMe})
        // console.log("Antes de pushearlo", messages)
        setMessages(messages => [...messages, {message: newMessage, sender: 'Me'}])
        // console.log("Despues de pushearlo", messages)
        setNewMessage('')
    }
    const [helpRequested, setHelpRequested] = useState(false)
    const requestHelp = () => {
        socket.emit('clientNeedHelp')
        setHelpRequested(true)
    }
    if(!token){
        return(
            <div>
                <h2>DEBES ESTAR LOGEADO PARA UTILIZAR EL CHAT</h2>
            </div>
        )
    }
    return(
        <div>
            <h4>Chat de Soporte</h4>
            <p>Numero de admins online: {adminsOnline}</p>
            {!helpRequested && <button onClick={requestHelp} type="button">Request Help</button>}
            {(helpRequested && !gotHelp) && <p>Help Requested! please wait...</p>}
            {(helpRequested && gotHelp) && <>
                <div className="chatBox">
                    {messages.map((message, index) => <p key={index}>{message.sender === "Me" ? 'Me: ' : 'Admin: '}{message.message}</p>)}
                </div>
                <input onChange={inputHandler} type="text" value={newMessage}></input>
                <button onClick={sendMessage}>SEND</button>
                </>
            }
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
export default connect(mapStateToProps, mapDispatchToProps)(UserChat)