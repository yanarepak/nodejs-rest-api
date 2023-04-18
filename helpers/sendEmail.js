const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "yanare@meta.ua",
    pass: META_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (email) => {
  const emailToSend = {
    ...email,
    from: "yanare@meta.ua",
  };

  transporter
  .sendMail(emailToSend)
    .then(() => {
      console.log("Success");
    })
    .catch((error) => console.log(error.message));
};

module.exports = {sendEmail};
