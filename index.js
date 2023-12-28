const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 5000;
const users = require("./MOCK_DATA.json");

// Middlewares
app.use(express.urlencoded({ extended: false }));
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
    return res.json(user);
  })
  .patch((req, res) => {
    //add patch
    return res.json({ status: "Pending" });
  })
  .delete((req, res) => {
    //ToDo: Add delete task
    return res.json({ status: "Pending" });
  });
app.post("/api/users", (req, res) => {
  const body = req.body;
  users.push({ id: users.length + 1, ...body });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "new user added", id: users.length });
  });
  console.log("Body", body);
});
app.listen(PORT, () => {
  console.log(`Server started at PORT:${PORT}`);
});
