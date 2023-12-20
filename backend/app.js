const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const clockRouter = require("./routes/clock");
const databaseRouter = require("./routes/database");
const users = require("./src/Users/Users.router");
const familyTree = require("./src/FamilyTree/FamilyTree.router");
const persons = require("./src/Persons/Persons.router");
const accessControl = require("./src/AccessControl/AccessControl.router");
const relationsships = require("./src/Persons/Relationsships/Relationsships.router");

const app = express();
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/persons", persons);
app.use("/", indexRouter);
app.use("/users", users);
app.use("/clock", clockRouter);
app.use("/database", databaseRouter);
app.use("/familyTree", familyTree);
app.use("/accessControl", accessControl);
app.use("/relationsships", relationsships);

module.exports = app;
