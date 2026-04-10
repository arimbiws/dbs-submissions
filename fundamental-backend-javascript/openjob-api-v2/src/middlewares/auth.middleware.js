const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized: Token missing or wrong format",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "failed",
      message: "Access denied. Invalid or expired token.",
    });
  }
};

module.exports = verifyToken;
