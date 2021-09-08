const City = require('../models/City')
const handleError = (res,err) =>{
    console.log(err.message)
    res.json({success: false, response: err.message})
}
const cityControllers = {
    getAllCities:(req, res) =>{
        console.log("Received Get Cities Petition:" + Date())
        City.find()
        .then(cities => res.json({success: true, response: cities}))
        .catch(err => handleError(res,err))
    },
    getACity:(req, res) =>{
        console.log("Received Get City Petition:" + Date())
        City.findOne({_id: req.params.id})
        .then(city => res.json({success: true, response: city}))
        .catch(err => handleError(res,err))
    },
    postACity:(req, res) =>{ 
        console.log("Received Post City Petition:" + Date())
        if(req.user.admin){
            const newCity = new City({...req.body})
            newCity.save()
            .then(city => res.json({success: true, response: city}))
            .catch(err => handleError(res,err))
        }else{
            res.json({success: false, response: "You don't have permissions"})
        }   
    },
    removeACity:(req, res) =>{
        console.log("Received Remove City Petition:" + Date())
        if(req.user.admin){
            City.findOneAndDelete({_id: req.body._id})
            .then(city => {
                city ? res.json({success: true, response: city}) : res.json({success: false, response: "no city found"})
            })
            .catch(err => handleError(res,err))
        }else{
            res.json({success: false, response: "You don't have permissions"})
        }
    },
    modifyACity:(req, res)=>{
        console.log("Received Modify City Petition:" + Date())
        if(req.user.admin){
            City.findOneAndUpdate({_id: req.body._id}, {...req.body}, {new:true})
            .then(city => {
                city ? res.json({success: true, response: city}) : res.json({success: false, response: "no city found"})
            })
            .catch(err => handleError(res,err))
        }else{
            res.json({success: false, response: "You don't have permissions"})
        }
    }
}
module.exports = cityControllers