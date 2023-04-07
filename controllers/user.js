const { User } = require("../models/usersModel");
const { Unauthorized } = require("http-errors");

const getCurrent = async (req, res) => {
  const { email } = req.user;

  const user = await User.findOne({ email });
  if (!user) {
    throw Unauthorized("Not authorized");
  }

  res.json({
    email: user.email,
    subscription: user.subscription,
  });
};

module.exports = getCurrent;