const mongoose = require("mongoose")
const chalk = require("chalk")
mongoose.connect(`mongodb+srv://rupe678:CGfwJF2NPp4a2fhK@cluster0.nnfqx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
   
useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false 
});

const connection = mongoose.connection;
connection.once("open", () => {
    console.log(chalk.greenBright.bold("Connected to Database Successfully !!!"))
})