const express = require("express");

const router = express.Router();

const Ticket = require("../models/Ticket");

const { protect } = require("../middleware/authMiddleware");

router.get(
  "/",
  protect,
  async (req, res) => {
    try {
      const q = req.query.q?.trim();

      if (!q) {
        return res.json({
          success: true,
          tickets: [],
        });
      }

      const tickets = await Ticket.find({
        $or: [
          {
            title: {
              $regex: q,
              $options: "i",
            },
          },
          {
            description: {
              $regex: q,
              $options: "i",
            },
          },
          {
            category: {
              $regex: q,
              $options: "i",
            },
          },
          {
            priority: {
              $regex: q,
              $options: "i",
            },
          },
          {
            status: {
              $regex: q,
              $options: "i",
            },
          },
        ],
      })
        .limit(8)
        .populate(
          "createdBy",
          "name email"
        );

      res.json({
        success: true,
        tickets,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message: "Search failed.",
      });
    }
  }
);

module.exports = router;