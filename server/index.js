require('dotenv').config();

const express = require('express');
const chalk = require('chalk');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

require('./models/mongo.js');

const dataManipulationRoute = require('./routes/itemMangementRoute');
const authRoute = require('./routes/authRoute');
const paymentRoute = require('./routes/paymentRoute');

app.get('/', (req, res) => {
  res.send('WELCOME TO BACKEND');
});

app.use('/auth', authRoute);
app.use('/groccery', dataManipulationRoute);
app.use('/payment', paymentRoute);

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(chalk.greenBright(`Server is Running on PORT: ${PORT}`));
});