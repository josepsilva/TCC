const express = require("express");
const router = express.Router();

//RETORNA TODOS OS ALUNOS
router.get("/", (req, res, next) => {
  res.status(200).send({
    mensagem: "Retorna os alunos",
  });
});

//INSERE UM ALUNO
router.post("/", (req, res, next) => {
  res.status(201).send({
    mensagem: "O aluno foi cadastrado",
  });
});

//RETORNA OS DADOS DE UM ALUNO
router.get("/:id_aluno", (req, res, next) => {
  const id = req.params.id_aluno;

  res.status(200).send({
    mensagem: "Detalhes de um aluno",
    id_aluno: id,
  });
});

//ALTERA OS DADOS DE UM ALUNO
router.patch("/", (req, res, next) => {
  res.status(201).send({
    mensagem: "Dados do aluno alterados",
  });
});

//EXCLUI UM ALUNO
router.delete("/", (req, res, next) => {
  res.status(201).send({
    mensagem: "Aluno excluído",
  });
});

module.exports = router;
