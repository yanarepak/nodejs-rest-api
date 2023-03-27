const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../models/contacts");

const { contactSchema, updateSchema } = require("../schemas/joi.schema");

const getContacts = async (reg, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

const getContactWithId = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      const error = new Error("Contact not found");
      error.status = 404;
      throw error;
    }
    return res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: "missing required name field" });
    }
    const { name, email, phone } = req.body;
    const newContact = await addContact(name, email, phone);
    return res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contacts = await removeContact(contactId);
    if (!contacts) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
};

const changeContact = async (req, res, next) => {
  try {
    const { error } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const { contactId } = req.params;

    const update = await updateContact(contactId, req.body);

    !update
      ? res.status(404).json({ message: `Contact ${contactId} not found` })
      : res.status(200).json(update);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContacts,
  getContactWithId,
  createContact,
  deleteContact,
  changeContact,
};
