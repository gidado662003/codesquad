const app = require("./app");
const db = require("./config/db");

const startServer = async () => {
  try {
    await db();
    app.listen(5000, () => {
      console.log("server running successfully");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
