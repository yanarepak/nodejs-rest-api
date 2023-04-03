const app = require("./app");
const mongoose = require("mongoose");

const DB_URI = process.env.DB_URI;

const startServer = async () => {
  try {
    await mongoose.connect(DB_URI);
    app.listen(3000, () => {
      console.log("Database connection successful. Use our API on port: 3000");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
