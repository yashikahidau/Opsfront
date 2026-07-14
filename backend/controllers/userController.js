const User = require("../models/User");

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

module.exports = {
     getAgents,
};