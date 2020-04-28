const express = require('express'); 
const mongoose = require("mongoose");
const { MONGOURI, API_KEY } = require('./config/keys');
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path')






mongoose.connect( MONGOURI,{ useNewUrlParser: true, useUnifiedTopology: true},(err)=>{
    if(err) return err; 
    console.log('successfully connected to the data base')
});



const app = express();
app.use(cors());
app.use(express.urlencoded({ extended : false}));
app.use(bodyParser());
app.use(require('./routes/auth')); 
app.use(require('./routes/post')); 
app.use(require('./routes/user')); 

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

PORT= process.env.PORT  || 5000 ; 


app.listen(PORT, ()=>{
    console.log("server is running")
})