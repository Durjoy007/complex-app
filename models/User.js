const validator = require("validator")


let User = function(data){
    this.data = data
    this.errors = []
}

User.prototype.validate = function(){
    if (typeof(this.data.username) != "string") {this.data.username = ""}
    if (typeof(this.data.emai) != "string") {this.data.emai = ""}
    if (typeof(this.data.password) != "string") {this.data.password = ""}

    // get rid of bogus property
    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
}

User.prototype.validate = function(){
    if(this.data.username != "" && !validator.isAlphanumeric(this.data.username)){this.errors.push("you must provide user name")}
    if(!validator.isEmail(this.data.email)){this.errors.push("you must provide email")}
    if(this.data.password == ""){this.errors.push("you must provide password")}
    if(this.data.password.length > 0 && this.data.password.length <12){this.errors.push("you must provide password")}
    if(this.data.password.length > 100){this.errors.push("you are exceeding the limit")}
    if(this.data.username.length > 0 && this.username.length <3){this.errors.push("this is not a valid username")}
    if(this.data.username.length > 30){this.errors.push("your username exceeding limit")}
}

User.prototype.register = function(){
    // Step-01: validate user given information
    this.validate()
    this.cleanUp()
}

module.exports = User