const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

router.get("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/callback", authController.callback);
// router.get("/refresh-token", authController.refreshToken);

module.exports = router;
