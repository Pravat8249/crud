const express = require('express')
const app = express();
const router =require("./routes/route")
const multer = require('multer')
const bodyParser = require('body-parser')
const mongoose= require('mongoose')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use( multer().any())

mongoose.connect("mongodb+srv://Bhagaban:L2vSe5ZRZjoVfhOA@cluster0.ojbuh.mongodb.net/practice",{
    useNewUrlParser:true
})

.then(()=> console.log("MongoDb Connected"))
.catch(()=> console.log("Error connecting to MongoDB"))

app.use("/",router)

app.listen(3000,()=>{
    console.log("Connceted to port 3000")

})

