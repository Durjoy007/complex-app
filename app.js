const express = require("express")
const port = process.env.port || 3000

const app = express()

const router = require("./router")

app.use(express.static("public"))
app.set("views", 'views')
app.set("view engine", "ejs")

app.use("/", router)


app.listen(port, function(req, res){
    console.log(`server is connected and running on ${port}`)
})