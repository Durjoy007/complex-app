const express = require("express")
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const flash = require("connect-flash")
// const port = process.env.port || 3000

const app = express()

let sessionOption = session({
    secret: "don't know what is this",
    store: new MongoStore({client: require("./database")}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24, httpOnly: true}
})

app.use(sessionOption)
app.use(flash())

const router = require("./router")

app.use(express.urlencoded({extended: false}))
app.use(express.json())


app.use(express.static("public"))
app.set("views", 'views')
app.set("view engine", "ejs")


// Routes
app.use("/", router)
app.use("/register", router)
app.use("/login", router)


module.exports = app