const Comment = require("../models/Comment");

const Ticket = require("../models/Ticket");

const logActivity = require("../utils/logActivity");

// ===============================
// GET COMMENTS
// ===============================

const getComments = async (req, res) => {
     try {
          const ticket = await Ticket.findById(req.params.ticketId);

          if (!ticket) {
               return res.status(404).json({
                    success: false,
                    message: "Ticket not found.",
               });
          }

          const comments = await Comment.find({
               ticket: req.params.ticketId,
          })
               .populate("author", "name email")
               .sort({ createdAt: 1 });

          res.json({
               success: true,
               comments,
          });
     } catch (err) {
          console.error(err);

          res.status(500).json({
               success: false,
               message: "Unable to fetch comments.",
          });
     }
};

// ===============================
// ADD COMMENT
// ===============================

const addComment = async (req, res) => {
     try {
          const { message } = req.body;

          if (!message?.trim()) {
               return res.status(400).json({
                    success: false,
                    message: "Comment cannot be empty.",
               });
          }

          const ticket = await Ticket.findById(req.params.ticketId);

          if (!ticket) {
               return res.status(404).json({
                    success: false,
                    message: "Ticket not found.",
               });
          }

          const comment = await Comment.create({
               ticket: ticket._id,
               author: req.user.id,
               message,
          });

          await comment.populate(
               "author",
               "name email"
          );

          await logActivity({
               ticket: ticket._id,
               user: req.user.id,
               type: "comment",
               message: "Added an internal comment",
          });

          res.status(201).json({
               success: true,
               comment,
          });
     } catch (err) {
          console.error(err);

          res.status(500).json({
               success: false,
               message: "Unable to add comment.",
          });
     }
};

module.exports = {
     getComments,
     addComment,
};