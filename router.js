const { Router } = require("express")
const express = require("express")
const router = express.Router()
let userController = require("./controllers/userController") 

// Base URL
router.get("/", userController.home)

router.post("/register", userController.register)

router.post("/login", userController.login)

router.post("/logout", userController.logout)


module.exports = router