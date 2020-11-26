const { Router } = require("express")
const express = require("express")
const router = express.Router()
let userController = require("./controllers/userController") 

// Base URL
router.get("/", userController.home)



module.exports = router