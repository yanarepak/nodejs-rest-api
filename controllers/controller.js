const { Contact } = require("../models/contactsModel");

const getContacts = async (reg, res, next) => {
  const contacts = await Contact.find({});
  res.status(200).json({ contacts });
};

const getContactWithId = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }
  res.status(200).json(contact);
};

const createContact = async (req, res) => {
  const newContact = await Contact.create(req.body);
  res.status(201).json(newContact);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const contacts = await Contact.findByIdAndDelete(contactId);
  if (!contacts) {
    return res.status(404).json({ message: "Contact not found" });
  }
  res.status(200).json({ message: "Contact deleted" });
};

const changeContact = async (req, res) => {
  const { contactId } = req.params;
  const update = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
  if (!update) {
    return res.status(404).json({ message: `Contact ${contactId} not found` })
  }
  res.status(200).json(update);
};

const updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const update = await Contact.findByIdAndUpdate(contactId, {favorite}, { new: true });
  if(!update){
    return res.status(404).json({message:`Contact ${contactId} not found`})
  }
  res.status(200).json(update)
}

module.exports = {
  getContacts,
  getContactWithId,
  createContact,
  deleteContact,
  changeContact,
  updateFavorite
};
