const { User } = require("../models/usersModel");
const { Conflict, Unauthorized } = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const uuid = require('uuid').v4;
const {sendEmail} = require("../helpers/sendEmail");
require("dotenv").config();

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new Conflict(`Email in use`);
  }
  const avatarURL = gravatar.url(email);
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = uuid(); 
  const result = await User.create({ name, email, password: hashPassword, avatarURL, verificationToken });
  
  const verifyMail = {
    to: email,
    subject: 'Verify email',
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Verify email</a>` 
  }
  await sendEmail(verifyMail);

  res.status(201).json({
    user: {
      name: result.name,
      email: result.email,
      avatarURL,
      verificationToken,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!user || !user.verify || !passwordCompare) {
    res.status(401).json({ message: `Email or password is wrong ` });
  }

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);

  if (!user) {
    throw Unauthorized("`Not authorized");
  }
  await User.findByIdAndUpdate(_id, { token: null });

  res.status(204).json({
    message: "Logout success",
  });
};

module.exports = {
  register,
  login,
  logout,
};
