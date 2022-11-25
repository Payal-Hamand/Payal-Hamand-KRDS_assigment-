const { default: mongoose } = require('mongoose')
const userModel = require('../model/userModel')
// const jwt = require('jsonwebtoken')
// const moment = require('moment')


const isValidRequestBody =function(requestBody){
    return Object.keys(requestBody).length == 0
}
const isValid = function(value){

    if (typeof (value)==='undefined'|| typeof(value)=== null){ return false }

    if (typeof(value)=== "string" && (value).trim().length == 0){return false } 
    
    return true

}


const isValidTitle = function (value){
    return ["Mr","Mrs","Miss"].indexOf(value) != -1
}


const createUser = async function(req,res){
  try{
        let data = req.body
    if(isValidRequestBody(data)){
        return res.status(400).send({status:false , message:'Please provide input'})
     }
     let {title,name,phone,email,password,address} = data

     if(!isValid(title)){
        return res.status(400).send({status:false , message:'Please provide title'})
     }
     if(!isValid(name)){
        return res.status(400).send({status:false , message:'Please provide name'})
     }
     if(!isValid(phone)){
        return res.status(400).send({status:false , message:'Please provide phone'})
     }
     if(!isValid(email)){
        return res.status(400).send({status:false , message:'Please provide email'})
     }
     if(!isValid(password)){
        return res.status(400).send({status:false , message:'Please provide password'})
     }
     
     if (!isValidTitle(title)) {
        return res.status(400).send({ status: false, message: 'Please provide appropriate title' })
    }
     if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.email))) {
        return res.status(400).send({ status: false, message: 'email should be a valid email address' })
    }
     let checkEmail = await userModel.findOne({ email: data.email })
            if (checkEmail) return res.status(400).send({status:false, message: "Email already exist" })
            
    if (!/^[2-9]\d{9}$/.test(phone)) {
    return res.status(400).send({ status: false, message: "Enter a valid mobile number" })
        }

    let checkMobile = await userModel.findOne({ phone: data.phone})
            if (checkMobile) {
                return res.status(400).send({ status: false,msg: "Mobile Number already exist" })
            }

            if(!/^[A-Za-z]\w{8,15}$/.test(password)){
                return res.status(400).send({ status: false, message: "Password should be greater than 8 and less than equal to 15" })
            }
     
    let saveData = await userModel.create(data)
    
    res.status(201).send({status:true,message:'success',data:saveData})
  }
  catch(err){
      return res.status(500).send({status:false , message:'error' , error:err.message})
  }
}


const loginUser = async function(req,res){
    try{
         let data= req.user
         if(!req.user){
             return res.redirect('/auth')
         }    
         let document = {
             name : data.displayName,
             email:data.emails[0].value,
             image:data.photos
 
         }
 
         let isExist = await userModel.findOne({email:data.emails[0].value})
         if(isExist) return res.status(200).json({success:true,data:isExist,message:"Login Successfully"})
         let doc = await userModel.create(document)
         return res.status(200).json({success:true,data:doc,message:"Login Successfully"})
     }
 catch(err){
     return res.status(500).json({error:err.message})
 }
 }

module.exports.createUser=createUser
module.exports.loginUser=loginUser





