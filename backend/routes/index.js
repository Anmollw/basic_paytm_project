const express = require("express");
const userRouter = require("./user");
const router = express.Router();



router.get('/user',userRouter)

module.exports= router

