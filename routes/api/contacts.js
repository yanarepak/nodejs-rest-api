const express = require("express");
const router = express.Router();
const {
  getContacts,
  getContactWithId,
  createContact,
  deleteContact,
  changeContact,
} = require("../../controllers/controller");

router.get("/", getContacts);

router.get("/:contactId", getContactWithId);

router.post("/", createContact);

router.delete("/:contactId", deleteContact);

router.put("/:contactId", changeContact);

module.exports = router;
