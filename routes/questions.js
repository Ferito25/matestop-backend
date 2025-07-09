const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const questionsPath = path.join(__dirname, "..", "questions.json");

// Obtener todas las preguntas
router.get("/", (req, res) => {
  fs.readFile(questionsPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "No se pudieron leer las preguntas" });
    }
    const questions = JSON.parse(data);
    res.json(questions);
  });
});

// Agregar una nueva pregunta
router.post("/", (req, res) => {
  const newQuestion = req.body;

  fs.readFile(questionsPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "No se pudieron leer las preguntas" });
    }

    const questions = JSON.parse(data);
    questions.push(newQuestion);

    fs.writeFile(questionsPath, JSON.stringify(questions, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "No se pudo guardar la nueva pregunta" });
      }
      res.status(201).json(newQuestion);
    });
  });
});

module.exports = router;
