const mongoose = require("mongoose");

let mongoDbConnection = async (url) => {
  try {
    return mongoose.connect(url);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting MongoDB:", error);
  }
};
//Creating Model
module.exports = { mongoDbConnection };
