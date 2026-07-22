const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const userPermission =
      req.user.userType === "customer"
        ? "customer"
        : req.user.role;

    if (!allowedRoles.includes(userPermission)) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to access this resource.",
      });
    }

    next();
  };
};

module.exports = authorize;