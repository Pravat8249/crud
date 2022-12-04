const express = require('express');
const router = express.Router()
const controller= require("../controllers/controller")
console.log(controller.userDetails())
router.get('/', function(req, res){
res.send("working")
})
router.post("/register",  async function (req, res){
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
} )
// router.post("/login", loginUser )
// router.post("/fetch/:userId", getUser )
// router.post("/update/:userId", updateUser )
// router.post("/delete/:userId", deleteUser )
 


module.exports = router;