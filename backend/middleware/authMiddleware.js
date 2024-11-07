const jwt = require("jsonwebtoken");

// authenticate the user
const authMiddleware = (req, res, next) => {
  // get the JWT token from the 'access_token' cookie,
  const token = req.cookies.access_token;

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add the user from payload of token
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;
