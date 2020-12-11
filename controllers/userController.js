const User = require("../models/User")

exports.login = function(req, res){
    let user = new User(req.body)
    user.login().then(function(result){
        req.session.user = {favColor: "black", username: user.data.username}
        req.session.save( function(){
            res.redirect("/")
        })
    }).catch(function(error){
        res.send(error)
    })
}

exports.logout = function(req, res){
    req.session.destroy( function() {
        res.redirect("/")
    })
    
}

exports.register = function(req, res){
    let user = new User(req.body)
    user.register()
    if (user.errors.length) {
        res.send(user.errors)
    }
    else{
        req.session.save(function(){
            res.redirect("/login")
        })
    }
}

exports.home = function(req, res){
    if (req.session.user) {
        res.render("home-dashboard", {username: req.session.user.username})
    } else {
        res.render("home-guest")        
    }
}