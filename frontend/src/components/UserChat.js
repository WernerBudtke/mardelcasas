import { connect } from "react-redux"
import { useEffect, useState, useRef } from "react"
import { io } from "socket.io-client"
import "../styles/userChat.css"
import "../styles/UserChat1.css"
import {ArrowBarDown, ArrowBarUp, XCircle} from "react-bootstrap-icons"
import { BiSend } from "react-icons/bi"

const UserChat = (props) =>{
    const {token} = props
    const [socket, setSocket] = useState(null)
    const [adminsOnline, setAdminsOnline] = useState(0)
    const [chatSwap, setChatSwap] = useState(false)
    const [gotHelp, setGotHelp] = useState(false)
    const [whoIsHelpingMe, setWhoIsHelpingMe] = useState('')
    const [messages, setMessages] = useState([])
    const [helpRequested, setHelpRequested] = useState(false)
    useEffect(()=>{
        if(!token){
            console.log("entre al disconnect del userchat")
            socket && socket.disconnect()
            return false
        }else{
            setSocket(io('https://mardelcasas.herokuapp.com', {
                auth:{
                    token: token
                }
            }))
        }
     //eslint-disable-next-line
    },[token])
    
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
        socket.on("iWillHelpYou", (adminInfo) =>{
            // console.log(adminInfo)
            setWhoIsHelpingMe(adminInfo.sender)
            setGotHelp(true)
        })
        socket.on("newMessage", (message) =>{
            console.log(message)
            // console.log("Cuando me llega el mensaje del admin", messages)
            setMessages(messages => [...messages, message])
            // console.log("Despues de pushearlo", messages)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[socket])

    if(socket){
        socket.on("resetAll", () =>{
            console.log("estoy aca")
            setMessages([])
            setGotHelp(false)
            setHelpRequested(false)
            setWhoIsHelpingMe('')
        })
    }
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
    
    const requestHelp = () => {
        console.log("Pedí ayuda")
        socket.emit('clientNeedHelp')
        setHelpRequested(true)
    }
    const keySubmit = (e)=>{
        // console.log(e.key)
        e.key === 'Enter' && sendMessage()
    }
    
    const chatHandler = () =>{
        setChatSwap(!chatSwap)
    }

    const commentsEndRef = useRef(null)

    const scrollToBottom = () => {
        if(commentsEndRef){
            commentsEndRef.current.scrollTo({  
                top: commentsEndRef.current.scrollHeight,
                behavior: 'smooth' 
            })
        } 
    }

    useEffect(() =>{
        if(!(helpRequested && gotHelp)){
            return false
        }
        if(!chatSwap){
            return false
        }
        scrollToBottom()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[messages, chatSwap])

    if(!token){
        return(
            <div className="haveToBeLogged">
                <h2>DEBES ESTAR LOGEADO PARA UTILIZAR EL CHAT</h2>
            </div>
        )
    }

    return(
        <div id="chatBoxHandler" className={chatSwap ? "growHeight" : "dontGrowHeight"}>
            {/* {!chatSwap && <button id="openSupportBtn" onClick={chatHandler}></button>} */}
            <div 
                className="openSupportDiv"
                onClick={chatHandler}
            > 
                {(!chatSwap && <ArrowBarUp /> || <ArrowBarDown />)} Número de operadores en línea: {adminsOnline} {chatSwap && <XCircle id="closeIcon" />}
            </div>                        
            {chatSwap && <div id="chatBoxContainer">
                {/* <button id="closeSupportBtn" onClick={chatHandler}>❌</button> */}
                <h4>¿Necesitas Ayuda?</h4>
                {/* <p id="onlineOperators">Numero de operadores online: {adminsOnline}</p> */}
                {(!helpRequested && adminsOnline > 0) && <button id="requestHelpBtn" onClick={requestHelp} type="button">CHATEAR</button>}
                {adminsOnline === 0 && <p id="noOperatorsOnline">En estos momentos no hay operadores, Por favor contactanos a: mardelcasas@gmail.com</p>}
                {(helpRequested && !gotHelp && adminsOnline > 0) && <p id="helpRequested">Ayuda solicitada! por favor espere...</p>}
                {(helpRequested && gotHelp && adminsOnline > 0) && <>
                    <div id="chatBox" ref={commentsEndRef}>
                        {messages.map((message, index) => 
                            <span key={index}>  
                                <p className={message.sender === "Me" ? 'myMsg' : 'hisMsg'}>{message.sender === "Me" ? 'Yo' : 'Soporte'}</p>
                                <p className={message.sender === "Me" ? 'myMsg' : 'hisMsg'}>{message.message}</p>
                            </span>
                        )}
                    </div>
                    <div id="msgInputs">
                        {/* <input id="msgInput" onChange={inputHandler} onKeyDown={keySubmit} type="text" value={newMessage}></input> */}
                        <textarea id="msgTextArea" onChange={inputHandler} onKeyDown={keySubmit} type="text" value={newMessage}> </textarea>
                        <button id="sendBtn" onClick={sendMessage}><BiSend width="2" height="2"/></button>
                    </div>
                    </>
                }
            </div>}
        </div>
    )
}

const mapStateToProps = (state) =>{
    return {
        token: state.user.token,
        admin: state.user.admin
    }
}

export default connect(mapStateToProps)(UserChat)