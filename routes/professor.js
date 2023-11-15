const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    let data = new Date().toISOString().replace(/:/g, "-") + "-";
    cb(null, data + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

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
            id: prof.id,
            nome: prof.nome,
            materia: prof.materia,
            imagem_professor: prof.imagem_professor,
            request: {
              tipo: "GET",
              descricao: "Retorna os detalhes de um professor específico",
              url: "http://localhost:300/professor/" + prof.id,
            },
          };
        }),
      };
      return res.status(200).send(response);
    });
  });
});

//INSERE UM PROFESOR
router.post("/", upload.single("professor_imagem"), (req, res, next) => {
  console.log(req.file);
  mysql.getConnection((error, conn) => {
    if (error) {
      console.error(error);
      res.status(500).send({ error: error });
    }
    conn.query(
      "INSERT INTO professor (nome, materia, imagem_professor) VALUES (?,?,?)",
      [req.body.nome, req.body.materia, req.file.path],
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
            imagem_professor: req.file.path,
            request: {
              tipo: "POST",
              descricao: "Isere um professor",
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
router.get("/:id", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM professor WHERE id = ?;",
      [req.params.id],
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
            id: result[0].id,
            nome: result[0].nome,
            materia: result[0].materia,
            imagem_professor: result[0].imagem_professor,
            request: {
              tipo: "GET",
              descricao: "Retorna um professor",
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
      "UPDATE professor SET nome = ?, materia = ? WHERE id = ?",
      [req.body.nome, req.body.materia, req.body.id],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          mensagem: "Professor atualizado com sucesso",
          professorAtualizado: {
            id: req.body.id,
            nome: req.body.nome,
            materia: req.body.materia,
            request: {
              tipo: "GET",
              descricao: "Retorna os detalhes de um professor específico",
              url: "http://localhost:300/professor/" + req.body.id,
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
      "DELETE FROM professor WHERE id = ?",
      [req.body.id],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          mensagem: "Professor removido com sucesso",
          request: {
            tipo: "DELETE",
            descricao: "Remove um professor",
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
