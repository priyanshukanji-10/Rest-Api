const express = require("express");
const app = express();
const PORT = 5000;
const users=require('./MOCK_DATA.json')

// Routes
app.get("/users",(req,res)=>{
    return res.json(users)
})
app.listen(PORT, () => {
  console.log(`Server started at PORT:${PORT}`);
});
