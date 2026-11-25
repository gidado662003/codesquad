const app = require("./app");
const db = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await db();
    app.listen(PORT, () => {
      console.log(`server running successfully on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
