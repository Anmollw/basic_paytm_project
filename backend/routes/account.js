const express = require("express");
const { authmiddleware } = require("../middleware");
const mongoose = require("mongoose");
const { Account } = require("../db")
const accountrouter = express.Router();



accountrouter.get("/balance",authmiddleware, async (req,res)=>{
    const account = await Account.findOne({
        userId : req.userId
    });
    
    res.status(200).json({
        balance : account.balance
    });

});


accountrouter.post('/transfer',authmiddleware,async (req,res)=>{
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount , to } = req.body;
    const account = await Account.findOne({
        userId : req.userId
    })

    if (!account || account.balance < amount){
        await session.abortTransaction();
        return res.status(400).json({
            message : "Insufficient Balance"
        });
    }

    const toaccount = await Account.findOne({
        userId : to 
    })

    if(!toaccount){
        await session.abortTransaction();
        return res.status(400).json({
            message : "Invalid Account"
        });
    
    }
    
    await Account.updateOne({
        userId : req.userId
    },{
        $inc : { balance : - amount}
    }).session(session);
    
    await Account.updateOne({
        userId : to
    },{
        $inc : { balance : amount}
    }).session(session);


    await session.commitTransaction();
    res.status(200).json({
        message : "Transfer Successful"
    });

})







module.exports = accountrouter
