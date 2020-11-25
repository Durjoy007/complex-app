const { Router } = require("express")
const express = require("express")
const router = express.Router()

// Base URL
router.get("/", function(req, res){
    res.render("home-guest")
})



module.exports = router