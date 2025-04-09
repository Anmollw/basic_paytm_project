import mongoose from "mongoose";
import {  Schema  } from "zod";
const { mongodb_url } = require ("./mongodbcofig")
mongoose.connect(mongodb_url);

const Userschema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

const User = mongoose.model('User',Userschema)



const Accountschema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    balance : {
        type : Number,
        required : true
    }
});


const Account = mongoose.model("Account",Accountschema)


module.exports={
    User,
    Account,
};

