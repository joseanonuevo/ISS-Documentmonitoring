const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
app.use(cookieParser());

const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

//import routes
const emailService = require("./routes/emailService");
const auth = require("./routes/auth");
const routes = require("./routes/routes");
const upload = require("./routes/upload");
const functions = require("./routes/functions");

//thing used to parse
app.set("view engine", "hbs");
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

//middleware
app.use("/auth", auth);
app.use("/api", emailService);
app.use("/", routes);
app.use("/upload", upload);
app.use("/functions", functions);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server @ " + PORT);
});
