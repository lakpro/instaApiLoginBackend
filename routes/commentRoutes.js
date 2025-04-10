const express = require("express");
const {
  replyToComment,
  getComments,
} = require("../controller/commentController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.get("/:mediaId", getComments);

router.post("/reply", replyToComment);

module.exports = router;
