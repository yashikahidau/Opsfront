const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
     return jwt.sign(
          {
               userId: user._id,
               role: user.role,
               userType: user.userType,
          },
          process.env.JWT_SECRET,
          {
               expiresIn:
                    process.env.JWT_EXPIRES_IN || "7d",
          }
     );
};

const sanitizeUser = (user) => ({
     id: user._id,
     name: user.name,
     email: user.email,
     workspaceName: user.workspaceName,

     userType: user.userType,
     role: user.role,
     isActive: user.isActive,
     lastSeen: user.lastSeen,

     createdAt: user.createdAt,
     updatedAt: user.updatedAt,
});

const googleLogin = async (req, res) => {
     try {
          const { credential } = req.body;

          if (!credential) {
               return res.status(400).json({
                    success: false,
                    message: "Google credential is required.",
               });
          }

          const ticket =
               await client.verifyIdToken({
                    idToken: credential,
                    audience:
                         process.env.GOOGLE_CLIENT_ID,
               });

          const payload = ticket.getPayload();

          if (!payload) {
               return res.status(401).json({
                    success: false,
                    message: "Invalid Google token.",
               });
          }

          const {
               sub,
               email,
               name,
          } = payload;

          let user = await User.findOne({
               email,
          });

          if (!user) {

               const userCount = await User.countDocuments();
               const isFirstUser = userCount === 0;

               user = await User.create({
                    name,
                    email,
                    password: null,

                    workspaceName: `${name}'s Workspace`,

                    provider: "google",
                    googleId: sub,

                    userType: isFirstUser
                         ? "internal"
                         : "customer",

                    role: isFirstUser
                         ? "owner"
                         : null,

                    isActive: true,
               });

          } else if (
               user.provider === "local" &&
               !user.googleId
          ) {
               user.googleId = sub;
               await user.save();
          }

          user.lastSeen = new Date();
          await user.save();

          const token = generateToken(user._id);

          return res.status(200).json({
               success: true,
               message: "Google login successful.",
               token,
               user: sanitizeUser(user),
          });
     } catch (error) {
          console.error(error);

          return res.status(500).json({
               success: false,
               message:
                    "Google authentication failed.",
          });
     }
};

module.exports = {
     googleLogin,
};