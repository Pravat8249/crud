const mongoose = require('mongoose')

const userSchema= new mongoose.Schema({
    userName : {
        type: 'string',
        required: true,
        trim : true
    },
    phone: {
        type: 'string',
        required: true,
        trim : true
    },
    email:{
        type: 'string',
        required: true,
        trim : true
    },
    password:{
        type : 'string',
        required: true,
        trim : true

    },
    uploadImage:{
        type : 'string',
        required: true,
        trim : true

    }
   
},{timesStamp:true}) 

module.exports = mongoose.model("users", userSchema)