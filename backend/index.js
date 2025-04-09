const express = require("express");
const cors = require("cors");
const app = express();


app.use(cors());
app.use(express.json());

const mainRouter = require ('./routes/index.js');



app.use("/api/v1", mainRouter)
app.listen(3000, () => console.log("Server running on port 3000"));