const { Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const { User } = require("../models/usersModel");

const { SECRET_KEY } = process.env;

const authorize = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer") {
      throw Unauthorized("Not authorized");
    }
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token) {
      throw Unauthorized("Not authorized");
    }
    req.user = user;
    next();
  } catch (error) {
    if (error) {
      throw res.status(401).json({ message: "Not authorized" });
    }
    next(error);
  }
};

module.exports = authorize;
