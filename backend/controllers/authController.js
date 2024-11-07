const User = require("../models/User");
const jwt = require("jsonwebtoken");

// create token, set cookie and send response
const createTokenAndSendResponse = (user, statusCode, message, res) => {
  const payload = { user: { id: user.id } };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10h" });

  res
    .status(statusCode)
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      maxAge: 10 * 60 * 60 * 1000,
    })
    .json({ msg: { message }, user });
};

// create a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    // Check for existing user
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });
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
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: "Please enter all fields" });

    // Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    createTokenAndSendResponse(user, 200, "user login successfully!", res);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
