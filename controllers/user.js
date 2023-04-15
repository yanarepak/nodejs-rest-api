const { User } = require("../models/usersModel");
const { Unauthorized } = require("http-errors");
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

module.exports = { getCurrent, updateAvatar };
