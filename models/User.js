const bcrypt = require("bcryptjs")
const usersCollection = require("../database").db().collection("users")
const validator = require("validator")


let User = function(data){
    this.data = data
    this.errors = []
}

User.prototype.cleanUp = function(){
    if (typeof(this.data.username) != "string") {this.data.username = ""}
    if (typeof(this.data.emai) != "string") {this.data.email = ""}
    if (typeof(this.data.password) != "string") {this.data.password = ""}

    // get rid of bogus property
    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
}

User.prototype.validate = function(){
    if(this.data.username == "") {this.errors.push("you must provide user name")}
    if(this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("you must provide a valid username")}
    if(this.data.username.length > 0 && this.data.username.length < 3) {this.errors.push("this is not a valid username")}
    if(this.data.username.length > 30) {this.errors.push("your username exceeding limit")}

    if(!validator.isEmail(this.data.email)){this.errors.push("you must provide email")}

    if(this.data.password == ""){this.errors.push("you must provide password")}
    if(this.data.password.length > 0 && this.data.password.length <12){this.errors.push("you must provide a valid password")}
    if(this.data.password.length > 100){this.errors.push("you are exceeding the limit")}
}

User.prototype.login = function(){
    return new Promise((resolve, reject) => {
        this.cleanUp()
        usersCollection.findOne({username: this.data.username}).then((attemptedUser) => {
            if(attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)){
                resolve("successful login")
            } else{
                reject("invalid username / password")
            }
        }).catch(function(){
            reject("please try again later")
        })
    })
}

User.prototype.register = function(){
    // Step-01: validate user given information
    this.validate()
    this.cleanUp()

    // Step-02: connect valid user into database 
    if (!this.errors.length) {
        let salt = bcrypt.genSaltSync(10)
        this.data.password = bcrypt.hashSync(this.data.password, salt)
        usersCollection.insertOne(this.data)
    }
}

module.exports = User