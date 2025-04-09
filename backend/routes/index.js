const express = require("express");
const userRouter = require("./user");
const router = express.Router();
const accountrouter = require("./account");


router.use('/user',userRouter)
router.use('/account',accountrouter)

module.exports= router

