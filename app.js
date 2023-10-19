const express = require("express");
const app = express();

const rotaprofessor = require("./routes/professor");
const rotaalunos = require("./routes/alunos");

app.use("/professor", rotaprofessor);
app.use("/alunos", rotaalunos);

module.exports = app;
