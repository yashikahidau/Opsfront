const express = require("express");

const router = express.Router();

const {
  getComments,
  addComment,
} = require("../controllers/commentController");

const { protect } = require("../middleware/authMiddleware");

// ==========================
// GET ALL COMMENTS
// ==========================

router.get(
  "/:ticketId",
  protect,
  getComments
);

// ==========================
// ADD COMMENT
// ==========================

router.post(
  "/:ticketId",
  protect,
  addComment
);

module.exports = router;