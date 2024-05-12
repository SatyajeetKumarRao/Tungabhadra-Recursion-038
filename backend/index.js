require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./utils/db.config");

const { usersRouter } = require("./routes/users.routes");
const { mealsRouter } = require("./routes/meals.routes");

const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  try {
    res.status(200).json({ message: "Server Home Page" });
  } catch (error) {
    res.status(500).json({ message: `Some error occurred, Error : ${error}` });
  }
});

app.use("/users", usersRouter);

app.use("/meals", mealsRouter);
app.use("/apiDocs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.all("*", (req, res) => {
  try {
    res.status(404).json({ message: "404 Invalid Route" });
  } catch (error) {
    res.status(500).json({ message: `Some error occurred, Error : ${error}` });
  }
});

app.listen(process.env.PORT, async () => {
  await connectDB();
  console.log(`Server is running at port ${process.env.PORT}`);
});

module.exports = app;
