const jwt = require("jsonwebtoken");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/appError");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    const error = new AppError("Token is required", 401, httpStatusText.ERROR);
    return next(error);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    const error = new AppError(
      "Token format is invalid",
      400,
      httpStatusText.ERROR
    );
    return next(error);
  }

  // Verify the token
  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser;
    next();
  } catch (err) {
    let message = "Invalid token";
    if (err.name === "TokenExpiredError") {
      message = "Token has expired";
    }
    const error = new AppError(message, 401, httpStatusText.ERROR);
    return next(error); // Return after handling the error
  }
};

module.exports = verifyToken;
