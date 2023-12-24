const express = require("express");
const app = express();
const PORT = 5000;
const users = require("./MOCK_DATA.json");

// Routes
app.get("/users", (req, res) => {
  //Server side rendering
  const html = `
  <ul> 
 ${users.map((user) => `<li>${user.first_name}</li>`).join("")}} 
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
app.patch("/api/users", (req, res) => {
  //Todo:Add delete Patch
  return res.json({ status: "Pending" });
});
app.listen(PORT, () => {
  console.log(`Server started at PORT:${PORT}`);
});
