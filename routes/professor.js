const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

//RETORNA TODOS OS PROFESSORES
router.get("/", (req, res, next) => {
  res.status(200).send({
    mensagem: "Retorna todos os professores",
  });
});

//INSERE UM PROFESOR
router.post("/", (req, res, next) => {
  console.log("entrou aqui 0");
  mysql.getConnection((error, conn) => {
    if (error) {
      console.log("entrou aqui 1");
      console.error(error);
      res.status(500).send({ error: error });
    }
    conn.query(
      "INSERT INTO professor (nome, materia) VALUES (?,?)",
      [req.body.nome, req.body.materia],
      (error, resultado, field) => {
        console.log("entrou aqui 2");
        conn.release();

        if (error) {
          console.log("entrou aqui 3");
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        console.log("entrou aqui 4");
        res.status(201).send({
          mensagem: "Professor inserido com sucesso",
          id_professor: resultado.insertId,
        });
      }
    );
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
