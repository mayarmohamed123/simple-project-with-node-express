module.exports = (...roles) => {
  // ["Admin", "MANAGER", ]
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      return next(new appError("You don't have permission to do that"), 401);
    }
    next();
  };
};
