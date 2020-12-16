const bcrypt = require("bcryptjs")
const usersCollection = require("../database").db().collection("users")
const validator = require("validator")
const md5 = require("md5")


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

User.prototype.validate = function() {
    return new Promise(async (resolve, reject) => {
        if(this.data.username == "") {this.errors.push("you must provide user name")}
        if(this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("you must provide a valid username")}
        if(this.data.username.length > 0 && this.data.username.length < 3) {this.errors.push("this is not a valid username")}
        if(this.data.username.length > 30) {this.errors.push("your username exceeding limit")}
    
        if(!validator.isEmail(this.data.email)){this.errors.push("you must provide email")}
    
        if(this.data.password == ""){this.errors.push("you must provide password")}
        if(this.data.password.length > 0 && this.data.password.length <12){this.errors.push("you must provide a valid password")}
        if(this.data.password.length > 100){this.errors.push("you are exceeding the limit")}
    
        // only if username is valid then check whether it is already taken or not
        if (this.data.username.length >2 && this.data.username.length <31 && validator.isAlphanumeric(this.data.username)) {
            let userExists = await usersCollection.findOne({username: this.data.username})
            if (userExists) {this.errors.push("this name is already taken")}
        }
    
        // only if email is valid then check whether it is already taken or not
        if (validator.isEmail(this.data.email)) {
            let emailExists = await usersCollection.findOne({email: this.data.email})
            if (emailExists) {this.errors.push("this email address is already taken")}
        }

        resolve()
    })
}

User.prototype.login = function(){
    return new Promise((resolve, reject) => {
        this.cleanUp()
        usersCollection.findOne({username: this.data.username}).then((attemptedUser) => {
            if(attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)){
                this.data = attemptedUser
                this.getAvatar()
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
    return new Promise( async (resolve, reject) => {
        // Step-01: validate user given information
        this.cleanUp()
        await this.validate()
    
        // Step-02: connect valid user into database 
        if (!this.errors.length) {
            let salt = bcrypt.genSaltSync(10)
            this.data.password = bcrypt.hashSync(this.data.password, salt)
            await usersCollection.insertOne(this.data)
            this.getAvatar()
            resolve()
        }else{
            reject(this.errors)
        }
    })
}


User.prototype.getAvatar = function() {
    this.avatar = `http://gravatar.com/avatar/${md5(this.data.email)}?s=128`
}

module.exports = User