const express = require("express");
const router = express.Router();
const {
  getContacts,
  getContactWithId,
  createContact,
  deleteContact,
  changeContact,
  updateFavorite,
} = require("../../controllers/controller");
const { controllerWrapper } = require("../../middlewares/controllerWrapper");
const { validation } = require("../../middlewares/validation");
const {
  contactSchema,
  updateSchema,
  favoriteSchema,
} = require("../../schemas/contactSchema");
const authorize = require("../../middlewares/authorize");

router.get("/", authorize, controllerWrapper(getContacts));

router.get("/:contactId", controllerWrapper(getContactWithId));

router.post(
  "/",
  authorize,
  validation(contactSchema),
  controllerWrapper(createContact)
);

router.delete("/:contactId", controllerWrapper(deleteContact));

router.put(
  "/:contactId",
  validation(updateSchema),
  controllerWrapper(changeContact)
);

router.patch(
  "/:contactId/favorite",
  validation(favoriteSchema),
  controllerWrapper(updateFavorite)
);

module.exports = router;
