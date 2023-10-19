const express = require("express");
const router = express.Router();

//RETORNA TODOS OS PROFESSORES
router.get("/", (req, res, next) => {
  res.status(200).send({
    mensagem: "Retorna todos os professores",
  });
});

//INSERE UM PROFESOR
router.post("/", (req, res, next) => {
  res.status(201).send({
    mensagem: "Insere um novo professor",
  });
});

//RETORNA OS DADOS DE UM PROFESSOR
router.get("/:id_professor", (req, res, next) => {
  const id = req.params.id_professor;

  if (id === "Especial") {
    res.status(200).send({
      mensagem: "Você descobriu um P especial",
      id: id,
    });
  } else {
    res.status(200).send({
      mensagem: "Você passou um id",
    });
  }
});

//ALTERA OS DADOS DE UM PROFESSOR
router.patch("/", (req, res, next) => {
  res.status(201).send({
    mensagem: "Dados do professor alterado",
  });
});

//EXCLUI UM PROFESSOR
router.delete("/", (req, res, next) => {
  res.status(201).send({
    mensagem: "Professor excluído",
  });
});

module.exports = router;
