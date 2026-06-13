const mongoose = require("mongoose")
const chalk = require("chalk")
mongoose.connect(`mongodb+srv://rupesh123:Rupesh1299@grocery.rcthdnn.mongodb.net/`, {
   
useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false 
});

const connection = mongoose.connection;
connection.once("open", () => {
    console.log(chalk.greenBright.bold("Connected to Database Successfully !!!"))
})