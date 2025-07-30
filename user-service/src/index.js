const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const userRoutes = require("./user.routes");
app.use("/", userRoutes);
const PORT = process.env.USER_SERVICE_PORT || 4001;
const MONGO_URI = `${process.env.MONGO_URI}/${process.env.USER_DB_NAME}`;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log("User Service sur port", PORT))
  )
  .catch((err) => console.error("Erreur MongoDB:", err));
