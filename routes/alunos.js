const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

//RETORNA TODOS OS ALUNOS
router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query("SELECT * FROM alunos;", (error, result, fields) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      const response = {
        quantidade: result.length,
        alunos: result.map((alunos) => {
          return {
            id: alunos.id,
            nome: alunos.nome,
            idade: alunos.idade,
            serie: alunos.serie,
            bimestre1: alunos.bimestre1,
            bimestre2: alunos.bimestre2,
            bimestre3: alunos.bimestre3,
            bimestre4: alunos.bimestre4,
            materia: alunos.materia,
            professor_id: alunos.propfessor_id,

            request: {
              tipo: "GET",
              descricao: "Retorna os detalhes de um aluno específico",
              url: "http://localhost:300/alunos/" + alunos.id,
            },
          };
        }),
      };
      return res.status(200).send(response);
    });
  });
});

//INSERE UM ALUNO
router.post("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM professor WHERE id = ?",
      [req.body.id],
      (error, result, field) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: "Professor não encontrado",
          });
        }

        conn.query(
          "INSERT INTO alunos ( nome, idade, serie, b1, b2, b3, b4, professor_id ) VALUES (?,?,?,?,?,?,?,?)",
          [
            req.body.nome,
            req.body.idade,
            req.body.serie,
            req.body.b1,
            req.body.b2,
            req.body.b3,
            req.body.b4,
            req.body.professor_id,
          ],
          (error, result, field) => {
            conn.release();
            if (error) {
              return res.status(500).send({ error: error });
            }
            const response = {
              mensagem: "Aluno inserido com sucesso",
              AlunoAdicionado: {
                id: result.id,
                nome: req.body.nome,
                idade: req.body.idade,
                serie: req.body.serie,
                b1: req.body.b1,
                b2: req.body.b2,
                b3: req.body.b3,
                b4: req.body.b4,
                professor_id: req.body.professor_id,

                request: {
                  tipo: "POST",
                  descricao: "Isere um aluno",
                  url: "http://localhost:3000/alunos",
                },
              },
            };
            return res.status(201).send(response);
          }
        );
      }
    );
  });
});

//RETORNA OS DADOS DE UM ALUNO
router.get("/:id", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM alunos WHERE id = ?;",
      [req.params.id],
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: "Não foi encontrado aluno com esse ID",
          });
        }
        const response = {
          aluno: {
            id: result[0].id,
            nome: result[0].nome,
            idade: result[0].idade,
            serie: result[0].serie,
            b1: result[0].b1,
            b2: result[0].b2,
            b3: result[0].b3,
            b4: result[0].b4,
            request: {
              tipo: "GET",
              descricao: "Retorna um aluno",
              url: "http://localhost:3000/alunos",
            },
          },
        };
        return res.status(200).send(response);
      }
    );
  });
});

//ALTERA OS DADOS DE UM ALUNO
router.patch("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      console.error(error);
      res.status(500).send({ error: error });
    }
    conn.query(
      "UPDATE alunos SET nome = ?, idade = ?, serie = ?, b1 = ?, b2 = ?, b3 = ?, b4 = ? WHERE id = ?",
      [
        req.body.nome,
        req.body.idade,
        req.body.serie,
        req.body.b1,
        req.body.b2,
        req.body.b3,
        req.body.b4,
        req.body.id,
      ],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          mensagem: "Aluno atualizado com sucesso",
          AlunoAtualizado: {
            id: req.body.id,
            nome: req.body.nome,
            idade: req.body.idade,
            serie: req.body.serie,
            b1: req.body.b1,
            b2: req.body.b2,
            b3: req.body.b3,
            b4: req.body.b4,
            request: {
              tipo: "GET",
              descricao: "Retorna os detalhes de um aluno específico",
              url: "http://localhost:300/aluno/" + req.body.id,
            },
          },
        };
        return res.status(202).send(response);
      }
    );
  });
});

//EXCLUI UM ALUNO
router.delete("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      console.error(error);
      res.status(500).send({ error: error });
    }
    conn.query(
      "DELETE FROM alunos WHERE id = ?",
      [req.body.id],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          mensagem: "Aluno removido com sucesso",
          request: {
            tipo: "DELETE",
            descricao: "Remove um aluno",
            url: "http://localhost:3000/aluno",
            body: {
              id: "number",
              quantidade: "number",
              nome: "string",
              idade: "number",
              serie: "number",
              b1: "number",
              b2: "number",
              b3: "number",
              b4: "number",
            },
          },
        };
        return res.status(202).send(response);
      }
    );
  });
});

module.exports = router;
