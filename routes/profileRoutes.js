const express = require("express");
const { getProfile, getMedia } = require("../controller/profileController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.get("/me", verifyToken, getProfile);
router.get("/media", verifyToken, getMedia);

module.exports = router;
