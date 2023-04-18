const { User } = require("../models/usersModel");
const { Unauthorized } = require("http-errors");
const { sendEmail } = require("../helpers/sendEmail")
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");


const avatarDir = path.join(__dirname, "../", "public", "avatars");

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

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  try {
    const resultUpload = path.join(avatarDir, filename);
    const image = await Jimp.read(tempUpload);
    await image.resize(250, 250).write(tempUpload);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);
    const updateUserAvatar = await User.findByIdAndUpdate(_id, { avatarURL });
    if (!updateUserAvatar) {
      return res.status(401).json({ message: "Not authorized" });
    }
    return res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(tempUpload);
    throw error;
  }
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    res.status(404).json({ message: "User not found"})
  }

  await User.findByIdAndUpdate(user.id, {
    verify: true,
    verificationToken: null,
  });
  res.status(200).json({ message: "Verification successful" });
};

const resendEmail = async (req, res) => {
  const { email } = req.body;
  if(!email) {
    return res.status(400).json({ message: "Missing required field email"})
  }

  const user = await User.findOne({ email });

  if (!user ) {
    res.status(400).json({ message: "User not found"})
  }

  if(user.verify){
    return res.status(400).json({
      message: "Verification has already been passed"
    })
  }

  const data = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" http://localhost:3000/api/users/verify/${user.verificationToken}">Verify email</a>`,
  };

  await sendEmail(data);

  res.status(200).json({
    massage: "Verification email sent",
  });
};




module.exports = { getCurrent, updateAvatar, verify, resendEmail };
