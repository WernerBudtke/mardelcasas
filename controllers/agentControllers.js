const Agent = require('../models/Agent')
const handleError = (res,err) =>{
    console.log(err.message)
    res.json({success: false, response: err.message})
}
const agentControllers = {
    getAllAgents:(req, res) =>{
        console.log("Received Get Agents Petition:" + Date())
        Agent.find()
        .then(agents => res.json({success: true, response: agents}))
        .catch(err => handleError(res,err))
    },
    getAnAgent:(req, res) =>{
        console.log("Received Get Agent Petition:" + Date())
        Agent.findOne({_id: req.body._id})
        .then(agent => res.json({success: true, response: agent}))
        .catch(err => handleError(res,err))
    },
    addAnAgent:(req, res) =>{ 
        console.log("Received Post Agent Petition:" + Date())
        if(req.user.admin){
            const newAgent = new Agent({...req.body})
            newAgent.save()
            .then(agent => res.json({success: true, response: agent}))
            .catch(err => handleError(res,err))
        }else{
            res.json({success: false, response: "No tienes los permisos"})
        }   
    },
    removeAnAgent:(req, res) =>{
        console.log("Received Remove Agent Petition:" + Date())
        if(req.user.admin){
            Agent.findOneAndDelete({_id: req.body._id})
            .then(agent => {
                agent ? res.json({success: true, response: agent}) : res.json({success: false, response: "no se encontro el agente"})
            })
            .catch(err => handleError(res,err))
        }else{
            res.json({success: false, response: "No tienes los permisos"})
        }
    },
    modifyAnAgent:(req, res)=>{
        console.log("Received Modify Agent Petition:" + Date())
        if(req.user.admin){
            Agent.findOneAndUpdate({_id: req.body._id}, {...req.body}, {new:true})
            .then(agent => {
                agent ? res.json({success: true, response: agent}) : res.json({success: false, response: "no se encontro el agente"})
            })
            .catch(err => handleError(res,err))
        }else{
            res.json({success: false, response: "No tienes los permisos"})
        }
    }
}
module.exports = agentControllers