const User = require("../models/user");
let findUserById = async (req, res) => {
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
};
let updateUserById = async (req, res) => {
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
};
let deletedUserById = async (req, res) => {
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
};
let createUser = async (req, res) => {
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
};
module.exports = { findUserById, updateUserById, deletedUserById, createUser };
