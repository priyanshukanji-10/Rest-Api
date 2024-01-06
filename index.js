const express = require("express");
const app = express();
const userRouter = require("./routes/user");
const { mongoDbConnection } = require("./connection");
const { logResReq } = require("./middlewares/user");
// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(logResReq);
// Connention To mongoDB
mongoDbConnection("mongodb://127.0.0.1:27017/rest-api-db");

app.use("/api/users", userRouter); //Router for api dynamic routes.

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server started at PORT:${PORT}`);
});
