
require('dotenv').config()

const express = require('express')
const chalk = require('chalk')
const cors = require('cors')

const app = express()
app.use(cors())
app.options('*', cors())
app.use(express.json())

require('./models/mongo.js')

const dataManipulationRoute = require('./routes/itemMangementRoute')
const authRoute = require('./routes/authRoute')
const paymentRoute = require('./routes/paymentRoute')

app.get('/', (request, response) => {
  response.send('WELCOME TO BACKEND')
})

app.use('/auth', authRoute)
app.use('/groccery', dataManipulationRoute)
app.use('/payment', paymentRoute)

app.listen(9000, () => {
  console.log(chalk.greenBright('Server is Running on PORT:9000'))
})