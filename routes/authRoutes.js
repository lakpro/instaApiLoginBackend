const express = require("express");
const router = express.Router();
const authContoller = require("../controller/authContoller");

router.get("/login", authContoller.login);
router.get("/callback", authContoller.callback);
router.get("/refresh-token", authContoller.refreshToken);

module.exports = router;
