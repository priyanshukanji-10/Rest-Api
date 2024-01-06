const fs = require("fs");
let logResReq = async (req, res, next) => {
  let logMessage = `\n${Date.now()}:${req.method}:${req.path}${req.ip}`;
  fs.appendFile("./log.txt", logMessage, (err) => {
    console.log("log file appended");
  });
  next();
};
module.exports = { logResReq };
