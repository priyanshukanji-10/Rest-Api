const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 5000;
const users = require("./MOCK_DATA.json");

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  let logMessage = `\n${Date.now()}:${req.method}:${req.path}${
    req.ip
  } Status code of this req is ${res.statusCode}`;
  fs.appendFile("./log.txt", logMessage, (err) => {
    console.log("log file appended");
  });
  next();
});

// Routes
app.get("/users", (req, res) => {
  //Server side rendering
  const html = `
  <ul> 
 ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
  </ul>
  `;
  res.send(html);
});
//Restful API

app.get("/api/users", (req, res) => {
  return res.json(users);
});
app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  })
  .patch((req, res) => {
    const body = req.body;
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    Object.assign(user, body);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), () => {
      return res
        .status(202)
        .json({ status: "new user added", id: users.length });
    });
    res.send({ status: "User Updated" });
    console.log(body);
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
      users.splice(index, 1);
      fs.writeFile("./MOCK_Data.json", JSON.stringify(users), (err, data) => {
        if (err) {
          console.error("Error writing to file:", err);
          return res
            .status(500)
            .json({ status: "error", message: "Internal Server Error" });
        } else {
          return res
            .status(404)
            .json({ status: "error", message: "User not found" });
        }
      });
    }
  });
app.post("/api/users", (req, res) => {
  const body = req.body;
  if (
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.jobtitle
  ) {
    res.status(400).json({ Error: "All fields are req..." });
  } else {
    users.push({ id: users.length + 1, ...body });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), () => {
      return res
        .status(201)
        .json({ status: "new user added", id: users.length });
    });
    console.log("Body", body);
  }
});
app.listen(PORT, () => {
  console.log(`Server started at PORT:${PORT}`);
});
