const express = require("express");
const { registerUser, loginUser, updateUserProfile, deleteUser, getUserProfile, getAllUsers, logoutUser } = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const authenticateJWT = require("../middleware/auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser)
router.get("/profileAll", getAllUsers);
router.get("/profile", authenticateJWT, getUserProfile);
router.put("/update", authenticateJWT, updateUserProfile);
router.delete("/delete", authenticateJWT, deleteUser);
router.post("/logout", authenticateJWT, logoutUser);
module.exports = router;
