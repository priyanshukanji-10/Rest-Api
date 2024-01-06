const express = require("express");
const router = express.Router();
const User = require("../models/user");
// controllers
const {
  findUserById,
  updateUserById,
  deletedUserById,
  createUser,
} = require("../controllers/user");
//Restful API`
router.get("/", async (req, res) => {
  const dbAllUsers = await User.find({});
  res.status(200).json(dbAllUsers);
});
router
  .route("/:id")
  .get(findUserById)

  .patch(updateUserById)

  .delete(deletedUserById);

router.post("/", createUser);
module.exports = router;
