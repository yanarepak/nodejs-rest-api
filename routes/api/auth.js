const express = require("express");
const router = express.Router();
const { controllerWrapper } = require("../../middlewares/controllerWrapper");
const { validation } = require("../../middlewares/validation");
const { loginSchema, registerSchema, emailSchema } = require("../../schemas/userSchema");
const { register, login, logout } = require("../../controllers/auth");
const { getCurrent, updateAvatar, verify, resendEmail } = require("../../controllers/user");
const authorize = require("../../middlewares/authorize");
const { upload } = require("../../middlewares/upload");

router.post(
  "/register",
  validation(registerSchema),
  controllerWrapper(register)
);
router.post("/login", validation(loginSchema), controllerWrapper(login));
router.get("/logout", authorize, controllerWrapper(logout));
router.get("/current", authorize, controllerWrapper(getCurrent));
router.patch(
  "/avatars",
  authorize,
  upload.single("avatar"),
  controllerWrapper(updateAvatar)
);
router.get("/verify/:verificationToken",controllerWrapper(verify));
router.post("/verify", validation(emailSchema), controllerWrapper(resendEmail));

module.exports = router;
