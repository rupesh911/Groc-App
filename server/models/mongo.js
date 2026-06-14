// const mongoose = require("mongoose")
// const chalk = require("chalk")
// mongoose.connect(`mongodb+srv://rupesh123:Rupesh1299@grocery.rcthdnn.mongodb.net/`, {
   
// useCreateIndex: true,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false 
// });

// const connection = mongoose.connection;
// connection.once("open", () => {
//     console.log(chalk.greenBright.bold("Connected to Database Successfully !!!"))
// })

// // fill: rgb(12 10 9);

// // color: rgba(0, 0, 0, 0.54);
// //     padding: 4px;
const mongoose = require("mongoose");
const chalk = require("chalk");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(
      chalk.greenBright.bold("Connected to Database Successfully !!!")
    );
  })
  .catch((err) => {
    console.log(
      chalk.redBright.bold("Database Connection Failed !!!"),
      err.message
    );
  });