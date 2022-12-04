

const { default: mongoose } = require('mongoose')
const userModel = require('../models/model')

const jwt = require('jsonwebtoken')
const { uploadFile } = require("../aws/aws")

//check for valid objectId
const isValidObjectId = function (value){
    return mongoose.isValidObjectId(value)
}


//check for the requestbody cannot be empty --
const isValidRequestBody = function (value){
      return Object.keys(value).length > 0
}


//validaton check for the type of Value --

const isValid= function (value){
    if(typeof value === 'undefined' || typeof value === 'null') return false
    if(typeof value === 'string' || typeof value.trim().length === 0) return false
    if(typeof value != String) return false 
    return true
}


const userDetails = async function (req, res){
    try {
        let requestbody = req.body
        let image = req.files

        if(!isValidRequestBody(requestbody)){
            return res.status(400).send({ status: false, message: "invalid request parameters.plzz provide user details" })
          
        }
        let {  userName, email, phone, password } = requestbody

        if(!isValid(userName)){
            return res.status(400).send({status: false, message: "userName is required"})
        }
        if (!/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/.test(userName)) {
            return res.status(400).send({ status: false, message: "Please enter valid user name." })
        }
        if(!isValid(phone)){
            return res.status(400).send({status:false, message: "Phone number is required"})
        }
        if(!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone)){
            return res.status(400).send({ status: false, message:"please enter a valid phone number"})
        }
        if(!isValid(email)){
            return res.status(400).send({status:false, message: "Email is required"})
        }
let emailMatch = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/

        if (!email.match(emailMatch)){
            return res.status(400).send({ status: false, message:"please enter a valid email address"})
        } 

        email = email.toLowerCase().trim()
        const emailExt = await userModel.findOne({email:email})
        if(emailExt){
            return res.status(400).send({ status:false, message:"This email address is already Used"})
        }

        if(!isValid(password)){
            return res.status(400).send({status: false, message: "Password is required"})
        }
        if(password.length < 8 && password.length > 15){
            return res.status(400).send({status: false, message:"Please enter a valid password"})
        }

        if(!isValid){
            return res.status(400).send({status: false, message: "image is required"})
        }
        let images = await uploadFile(image[0])
        requestbody.uploadImage=images

        let saveData = await userModel.create(requestbody)
        return res.status(201).send({ status: true, message: "success", data: saveData })
 



    } catch (err) {
        return res.status(500).send({ status: "error", message: err.message })
    }
}

/////////////////LoginUser////////////////////////////////////////////

const loginUser = async function (req,res){
    try {
        const requestbody = req.body
        const {phone, password} = requestbody
        if(!isValidRequestBody(requestbody)){
            res.status(400).send({status:false,message: "Invalid request body"})
        }

        if(!isValid(phone)){
            res.status(400).send({status:false, message:"Phone number is "})
        }
        if(!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone)){
            res.status(400).send({status:false, message:"phone number is not valid"})
        }
        if(!isValid(password)){
            res.status(400).send({status:false, message:"Password is required"})
        }
        if(password.length < 8 || password.length > 15){
            res.status(400).send({status:false, message:"password must be at least 8 characters"})

        }

        let user = await userModel.findOne({phone,password})
        if(!user){
            res.status(400).send({status:false, message:"User not found"})
        }
        let token = jwt.sign({
            userId : user._id.toString(),
                    //         //this is the payload data to jwt token it will validate the issue at and exp time with particular userId. 
        },"practice",{expireIn:"3600s"})

        return res.status(200).send({status:true, message:"User successfully signed in ",token: token})
        

    
        

      
    } catch (err) {
        res.status(500).send({status:false, message:err.message})
    }
}

//_____________________________________Get User________________________________________________

const getUser = async function (req,res){
try {
    const user = req.params.userId
if(!isValidRequestBody(user)){
    res.status(400).send({status:false, message:"Invalid request"})
}
// const checkId = await userModel.findOne({ _id: userIdfromParams }).lean()
let findUser = await userModel.findOne({_id:user}).lean()
if(!findUser){
    res.status(404).send({status:false, message:"User not found"})
}
return res.status(200).send({ status: true, message: "User details", data: checkId })
} catch (err) {
    return res.status(500).send({status:false, message: err.message})
}
}






const updateUser = async function (req,res){
try {
    const userId = req.params.userId
    const data = req.body
    const { phone,password,uploadImage} = data
    let image = req.files
if(!isValidObjectId(userId)){
    res.status(400).send({status:false, message:"Plz enter valid user Id"})
}
let user = await userModel.findOne({_id: userId})
if(!user){
    res.status(404).send({status:false, message:"user not found"})
}
let update = (!( phone||password||uploadImage))
if(!(isValidRequestBody || update)){
    res.status(400).send({status:false, message:"please enter what to update"})

}
if(phone){
    if(!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone)){
        return res.status(400).send({ status: false, message:"please enter a valid phone number"})
    }
}
const findPhone = await userModel.findOne({phone:phone})
if(findPhone){
    res.status(400).send({status:false,message:"This phone number is already Exist"})
}
if(password){
    if(password.length < 8 && password.length > 15){
        return res.status(400).send({status: false, message:"Please enter a valid password"})
    }

}
if (image.length > 0) {
    let uploadedFileURL = await uploadFile(image[0])
    data.userImage = uploadedFileURL
    console.log(uploadedFileURL)
}

const updateUser = await findOneAndUpdate({_id:userId},{$set:{phone:phone,password:password, uploadImage:uploadImage}},{new:true})
return res.status(200).send({status:true,message:"User Update successfully",data:updateUser})
} catch (err) {
    res.status(500).send({status:false,message:err.message,})
}
    
}
const deleteUser = async function (req,res){
    try {
        const userId = req.params.userId
        if(!isValidObjectId(userId)){
            return res.status(404).send({status:false,message:'user not found'})
        }
        const deleteDetails = await userModel.findOneAndUpdate(
            {_id:userId, isDeleted:false},
            {$set:{isDeleted:true},deleteAt:new Date()},
            {new :true}
        )
        if(!deleteDetails){
            res.status(400).send({status:false,message:'User not found'})
        }
        return res.status(200).send({status:true,message:'User successfully deleted',data:deleteDetails})
    } catch (err) {
        res.status(500).send({status:false,message:err.message})
    }
}

module.exports = {userDetails,loginUser,getUser,updateUser,deleteUser}