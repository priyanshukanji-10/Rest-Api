const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 5000;
const mongoose = require("mongoose");
// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  let logMessage = `\n${Date.now()}:${req.method}:${req.path}${req.ip}`;
  fs.appendFile("./log.txt", logMessage, (err) => {
    console.log("log file appended");
  });
  next();
});
// Connention To mongoDB
mongoose.connect("mongodb://localhost:27017/rest-api-db");
//Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

//Creating Model
const User = mongoose.model("user", userSchema);

// Routes
app.get("/users", async (req, res) => {
  //Server side rendering
  const dbAllUsers = await User.find({});
  const html = `
  <ul> 
  ${dbAllUsers.map((user) => `<li>${user.firstName}</li>`).join("")}
  </ul>
  `;
  res.send(html);
});
//Restful API

app.get("/api/users", async (req, res) => {
  const dbAllUsers = await User.find({});
  return res.json(dbAllUsers);
});
app
  .route("/api/users/:id")
  .get(async (req, res) => {
    const id = req.params.id;

    await User.findById(id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(user);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        return res
          .status(500)
          .json({ status: "error", error: "Failed to retrieve user" });
      });
  })

  .patch(async (req, res) => {
    const id = req.params.id;

    await User.findByIdAndUpdate(id, {
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      email: req.body.email,
      gender: req.body.gender,
      jobTitle: req.body.jobtitle,
    })
      .then(() => {
        return res.status(200).json({ status: "user updated" });
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        return res
          .status(500)
          .json({ status: "error", error: "Failed to update user" });
      });
  })

  .delete(async (req, res) => {
    const id = req.params.id;

    try {
      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ status: "user deleted", deletedUser });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res
        .status(500)
        .json({ status: "error", error: "Failed to delete user" });
    }
  });

app.post("/api/users", async (req, res) => {
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
    try {
      const newUser = await User.create({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        gender: body.gender,
        jobTitle: body.jobtitle,
      });
      console.log("Body", body);

      return res.status(201).json({ status: "new user added", user: newUser });
    } catch (error) {
      console.error("Error creating user:", error);
      return res
        .status(500)
        .json({ status: "error", error: "Failed to add new user" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server started at PORT:${PORT}`);
});
