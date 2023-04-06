const express = require("express");
const router = express.Router();
const { controllerWrapper } = require("../../middlewares/controllerWrapper");
const { validation } = require("../../middlewares/validation");
const { loginSchema, registerSchema } = require("../../schemas/userSchema");
const {register, login, logout} = require('../../controllers/auth');
const getCurrent = require('../../controllers/user');
const authorize = require('../../middlewares/authorize');

router.post("/register", validation(registerSchema), controllerWrapper(register));
router.post("/login", validation(loginSchema), controllerWrapper(login));
router.get("/logout", authorize, controllerWrapper(logout));
router.get("/current", authorize, controllerWrapper(getCurrent));

module.exports = router;