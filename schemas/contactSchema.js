const joi = require("joi");

const contactSchema = joi.object({
  name: joi.string().alphanum().min(3).max(30).required(),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  phone: joi.string().required(),
});

const updateSchema = joi.object({
  name: joi.string().optional(),
  email: joi.string().optional(),
  phone: joi.string().optional(),
});

const favoriteSchema = joi.object({
  favorite: joi.bool().required(),
});

module.exports = {
  contactSchema,
  updateSchema,
  favoriteSchema,
};
