const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/cadastro", (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [req.body.email],
      (error, results) => {
        if (error) {
          return res.status(500).send({ error: error });
        }

        if (results.length > 0) {
          res.status(409).send({ mensagem: "Usuário já cadastrado" });
        } else {
          bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
            if (errBcrypt) {
              return res.status(500).send({ error: errBcrypt });
            }
            conn.query(
              "INSERT INTO usuarios (email, senha) VALUES (?, ?)",
              [req.body.email, hash],
              (error, results) => {
                conn.release();
                if (error) {
                  return res.status(500).send({ error: error });
                }
                response = {
                  mensagem: "Usuário criado com sucesso",
                  usuarioCriado: {
                    id_usuario: results.isertId,
                    email: req.body.email,
                  },
                };
                return res.status(201).send(response);
              }
            );
          });
        }
      }
    );
  });
});

router.post("/login", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    const query = "SELECT * FROM usuarios WHERE email = ?";
    conn.query(query, [req.body.email], (error, results, fields) => {
      conn.release();
      if (error) {
        return res.status(500).send({ error: error });
      }
      if (results.length < 1) {
        return res.status(401).send({ mensagem: "Falha na atenticação " });
      }
      bcrypt.compare(req.body.senha, results[0].senha, (err, results) => {
        if (err) {
          return res.status(401).send({ mensagem: "Falha na atenticação " });
        }
        if (results) {
          const token = jwt.sign(
            {
              id_usuario: results.id_usuario,
              email: results.email,
            },
            process.env.JWT_KEY,
            { expiresIn: "1" }
          );
          return res
            .status(200)
            .send({ mensagem: "Autenticado com sucesso", token: token });
        }
        return res.status(401).send({ mensagem: "Falha na atenticação " });
      });
    });
  });
});

module.exports = router;
