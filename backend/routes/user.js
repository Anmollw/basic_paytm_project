const express = require ("express");
const userRouter = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../jwtconfig");
const { User , Account } = require("../db");
const { authmiddleware } = require("../middleware");


const singupschema = zod.object({
    username : zod.string().email(),
    firstname : zod.string(),
    lastname : zod.string(),
    password : zod.string().min(6)
})

userRouter.post('/signup', async (req,res) => {
    const body = req.body;
    const {success} = singupschema.safeParse(req.body)
    if (!success){
        return res.status(400).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existinguser = await User.findOne({
        username : body.username
    })
    
    if (existinguser) {
        return res.status(411).json({
            message : "Email already taken / User already exists"
        })
    }
    
    const dbUser = await User.create(body)

    

    await Account.create({
        userId : dbUser._id,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userId : dbUser._id
    },JWT_SECRET);

    res.status(200).json({
        message: "User created successfully",
        token: token
    })

})


const signinschema = zod.object({
    username : zod.string().email(),
    password : zod.string()
})


userRouter.post('/signin',async (req,res)=> {
    const body = req.body
    const {success} = signinschema.safeParse(req.body)
    if (!success){
        return res.status(411).json({
            message : "Incorrect Inputs"
        })
    }
    const usercheck = await User.findOne({
        username : body.username,
        password: body.password
    });

    if(usercheck){
        const token = jwt.sign({
            userId : usercheck._id
        },JWT_SECRET);

        return res.status(200).json({
            token : token
        });
         
    }

    res.json({
        message : "Error while logging in"
    });

})

const updatebodyschema= zod.object({
    password : zod.string().optional(),
    firstname : zod.string().optional(),
    lastname : zod.string().optional()
})


userRouter.put('/',authmiddleware,async(req,res)=>{
   const {success} = updatebodyschema.safeParse(req.body);
   if(!success){
    return res.status(403).json({
        message : "Error while updating information"
    });
   }

   await User.updateOne(req.body,{
    id : req.userId
   })

   res.json({
    message : "Updated successfully"
   })
})



userRouter.get('/bulk', async (req,res)=>{
    const filter = req.query.filter || "" ;
    const users =  await User.find({
        $or : [{
            firstname :  {
                '$regex' : filter
            }
        },{
            lastname : {
                '$regex' : filter 
            }
        }] 
    })

    res.json({
        user : users.map(user => ({
            username : user.username,
            firstname : user.firstname,
            lastname : user.lastname,
            _id : user._id
        }))
    })
})

module.exports = userRouter
