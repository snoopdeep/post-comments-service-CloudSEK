const User = require("../models/User");
const jwt = require("jsonwebtoken");

// create token, set cookie and send response
const createTokenAndSendResponse = (user, statusCode, message, res) => {
  const payload = { user: { id: user.id } };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10h" });

  res.cookie("access_token", token, {
    httpOnly: true,
    maxAge: 10 * 60 * 60 * 1000,
  });

  res.status(statusCode).json({ message: { message }, token, user });
};

// create a new user
exports.register = async (req, res) => {
  console.log('this is create new user controller');
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    // Check for existing user
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });
    //create new user and save to db
    user = new User({ username, email, password });
    await user.save();

    createTokenAndSendResponse(user, 201, "user registered successfully!", res);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Login user
exports.login = async (req, res) => {
  console.log('this is login user controller');

  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Please enter all fields" });

    // Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "No user found" });

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    createTokenAndSendResponse(user, 200, "user login successfully!", res);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// logout user
exports.logout = async (req, res) => {
  console.log('this is logout user controller');

  try {
    res
      .status(200)
      .cookie("access_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true in production
        expires: new Date(0), // Expire the cookie immediately
      })
      .json({ message: "User logged out successfully!" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
