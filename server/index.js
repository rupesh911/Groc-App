
const express = require('express')

const chalk = require("chalk")
const cors = require('cors');

const app = express()
app.use(cors());
app.options('*', cors());


app.get('/',(request,response) =>{
    response.send('WELCOME TO BACKEND');
  
});


require("./models/mongo.js");
app.use(express.json());


const dataManipulationRoute = require('./routes/itemMangementRoute');
const { request, response } = require('express');
const { route } = require('./routes/itemMangementRoute');

app.use('/',dataManipulationRoute)
app.use('/groccery',dataManipulationRoute)

app.listen(8000,()=>{
    console.log(chalk.greenBright("Server is Running on PORT:8000"))
})