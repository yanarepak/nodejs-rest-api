const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "contacts.json");

const updateFile = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const contactsId = contacts.find(({ id }) => id === contactId);
    return contactsId || null;
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async (contactId) => {
  try {
    const data = await listContacts();
    const dataId = data.find((contact) => contact.id === contactId);
    if (!dataId) {
        throw new Error(`Not found contact ${contactId}`);
    }
    const newData = data.filter((contact) => contact.id !== contactId);

    await updateFile(newData);
    return newData;
} catch (error) {
    console.log(error);
}
};

const addContact = async ( name, email, phone) => {
  const contacts = await listContacts();
  const newContact = {
      id: uuidv4(),
      name,
      email,
      phone,
  };
  contacts.push(newContact);
  await updateFile(contacts);
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(({ id }) => id === contactId);

  if (index === -1) {
    return null;
  }

  contacts[index] = { ...contacts[index], ...body };
  updateFile(contacts);
  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
