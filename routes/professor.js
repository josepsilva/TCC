const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

//RETORNA TODOS OS PROFESSORES
router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query("SELECT * FROM professor;", (error, result, fields) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      const response = {
        quantidade: result.length,
        professores: result.map((prof) => {
          return {
            prof_id: prof.prof_id,
            nome: prof.nome,
            materia: prof.materia,
            request: {
              tipo: "GET",
              descricao: "Retorna os detalhes de um professor específico",
              url: "http://localhost:300/professor/" + prof.prof_id,
            },
          };
        }),
      };
      return res.status(200).send(response);
    });
  });
});

//INSERE UM PROFESOR
router.post("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      console.error(error);
      res.status(500).send({ error: error });
    }
    conn.query(
      "INSERT INTO professor (nome, materia) VALUES (?,?)",
      [req.body.nome, req.body.materia],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          mensagem: "Professor inserido com sucesso",
          professorAdicionado: {
            id_professor: result.id_professor,
            nome: req.body.nome,
            materia: req.body.materia,
            request: {
              tipo: "GET",
              descricao: "Retorna todos os professores",
              url: "http://localhost:3000/professor",
            },
          },
        };
        return res.status(201).send(response);
      }
    );
  });
});

//RETORNA OS DADOS DE UM PROFESSOR
router.get("/:id_professor", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM professor WHERE id_professor = ?;",
      [req.params.id_professor],
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: "Não foi encontrado professor com esse ID",
          });
        }
        const response = {
          professor: {
            id_professor: result[0].id_professor,
            nome: result[0].nome,
            materia: result[0].materia,
            request: {
              tipo: "GET",
              descricao: "Retorna todos os professores",
              url: "http://localhost:3000/professor",
            },
          },
        };
        return res.status(200).send(response);
      }
    );
  });
});

//ALTERA OS DADOS DE UM PROFESSOR
router.patch("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      console.error(error);
      res.status(500).send({ error: error });
    }
    conn.query(
      "UPDATE professor SET nome = ?, materia = ? WHERE id_professor = ?",
      [req.body.nome, req.body.materia, req.body.id_professor],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          mensagem: "Professor atualizado com sucesso",
          professorAtualizado: {
            id_professor: req.body.id_professor,
            nome: req.body.nome,
            materia: req.body.materia,
            request: {
              tipo: "GET",
              descricao: "Retorna os detalhes de um professor específico",
              url: "http://localhost:300/professor/" + req.body.id_professor,
            },
          },
        };
        return res.status(202).send(response);
      }
    );
  });
});

//EXCLUI UM PROFESSOR
router.delete("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      console.error(error);
      res.status(500).send({ error: error });
    }
    conn.query(
      "DELETE FROM professor WHERE id_professor = ?",
      [req.body.id_professor],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          mensagem: "Professor removido com sucesso",
          request: {
            tipo: "DELETE",
            descricao: "Insere um professor",
            url: "http://localhost:3000/professor",
            body: {
              nome: "string",
              materia: "string",
            },
          },
        };
        return res.status(202).send(response);
      }
    );
  });
});

module.exports = router;
