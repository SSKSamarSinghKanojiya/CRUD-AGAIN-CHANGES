const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

connectDB();

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
