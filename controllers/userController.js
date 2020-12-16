const User = require("../models/User")

exports.login = function(req, res){
    let user = new User(req.body)
    user.login().then(function(result){
        req.session.user = {avatar: user.avatar, username: user.data.username}
        req.session.save( function(){
            res.redirect("/")
        })
    }).catch(function(error){
        res.redirect("/")
    })
}

exports.logout = function(req, res){
    req.session.destroy( function() {
        res.session.flash(function(){
            res.redirect("/")
        })
    })
    
}

exports.register = function(req, res){
    let user = new User(req.body)
    user.register().then( () => {
        req.session.user = {username: user.data.username, avatar: user.data}
        res.redirect("/")
    }).catch( () => {
        user.errors.forEach(function(error){
            req.flash("regError", error)
        })
        
        req.session.save(function(){
            res.redirect("/")
        })
    }
    )}

exports.home = function(req, res){
    if (req.session.user) {
        res.render("home-dashboard", {username: req.session.user.username, avatar: req.session.user.avatar})
    } else {
        res.render("home-guest", {errors: req.flash("error"), regErrors: req.flash("regError")})        
    }
}