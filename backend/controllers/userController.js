const User = require("../models/User");
const Ticket = require("../models/Ticket");
const bcrypt = require("bcryptjs");

const getAgents = async (req, res) => {
     try {
          const users = await User.find({
               role: "agent",
          })
               .select("name email role")
               .sort({ name: 1 });
          res.json({
               success: true,
               users,
          });
     } catch (err) {
          console.error(err);

          res.status(500).json({
               success: false,
               message: "Unable to fetch users.",
          });
     }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email role createdAt")
      .sort({ name: 1 });

    const result = await Promise.all(
      users.map(async (user) => {
        const assignedTickets =
          await Ticket.countDocuments({
            assignedTo: user._id,
          });

        const openTickets =
          await Ticket.countDocuments({
            assignedTo: user._id,
            status: {
              $in: [
                "open",
                "in-progress",
                "waiting",
              ],
            },
          });

        const resolvedTickets =
          await Ticket.countDocuments({
            assignedTo: user._id,
            status: "resolved",
          });

        return {
          ...user.toObject(),
          assignedTickets,
          openTickets,
          resolvedTickets,
        };
      })
    );

    res.json({
      success: true,
      users: result,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to fetch users.",
    });
  }
};

const updateRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (
      !["admin", "agent", "requester"].includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid role.",
      });
    }

    const user =
      await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      ).select("name email role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to update role.",
    });
  }
};

const getAssignedTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({
      assignedTo: req.params.id,
    })
      .populate(
        "createdBy",
        "name"
      )
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      tickets,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch tickets.",
    });
  }
};

const reassignTickets = async (req, res) => {
  try {
    const { fromUserId, toUserId } = req.body;

    if (!fromUserId || !toUserId) {
      return res.status(400).json({
        success: false,
        message: "Both users are required.",
      });
    }

    const result = await Ticket.updateMany(
      {
        assignedTo: fromUserId,
      },
      {
        assignedTo: toUserId,
      }
    );

    res.json({
      success: true,
      modified: result.modifiedCount,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to reassign tickets.",
    });
  }
};

const createAgent = async (req, res) => {
  try {
    const {
      name,
      email,
      workspaceName,
      password,
      role,
    } = req.body;

    if (
      !name ||
      !email ||
      !workspaceName ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const exists = await User.findOne({
      email,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      workspaceName,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to create user.",
    });
  }
};

module.exports = {
     getAgents,
     getUsers,
     updateRole,
     getAssignedTickets,
     reassignTickets,
      createAgent,
};