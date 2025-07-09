const express = require("express");
const cors = require("cors");
const app = express();

// Middleware para permitir CORS y parsear JSON del body
app.use(cors());
app.use(express.json());

// Cargar el router de preguntas guardadas en questions.json
const questionsRouter = require('./routes/questions');
app.use('/questions', questionsRouter);

// Preguntas dinámicas de 1º de primaria
const temasPrimaria1 = {
  "Números y comparación": {
    "Leer y escribir hasta el 10": () => {
      const num = Math.floor(Math.random() * 11);
      const enLetra = ["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve","diez"];
      return { pregunta: `¿Cómo se escribe el número ${num} en letras?`, respuesta: enLetra[num] };
    },
    "Comparar dos números": () => {
      const a = Math.floor(Math.random() * 10);
      const b = Math.floor(Math.random() * 10);
      const signo = a > b ? ">" : a < b ? "<" : "=";
      return { pregunta: `¿Qué símbolo va entre ${a} y ${b}? (>, < o =)`, respuesta: signo };
    }
  },
  "Sumas y restas hasta 10": {
    "Sumas hasta 10": () => {
      const a = Math.floor(Math.random() * 6);
      const b = Math.floor(Math.random() * (11 - a));
      return { pregunta: `¿Cuánto es ${a} + ${b}?`, respuesta: (a + b).toString() };
    },
    "Restas hasta 10": () => {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * (a + 1));
      return { pregunta: `¿Cuánto es ${a} - ${b}?`, respuesta: (a - b).toString() };
    }
  },
  "Decenas y unidades / Sumas sin llevar": {
    "Identificar decenas y unidades": () => {
      const dec = Math.floor(Math.random() * 5) + 1;
      const uni = Math.floor(Math.random() * 10);
      return { pregunta: `¿Cuántas decenas y unidades tiene ${dec*10 + uni}?`, respuesta: `${dec} decenas y ${uni} unidades` };
    },
    "Sumas de dos cifras sin llevar": () => {
      const a = Math.floor(Math.random() * 30) + 10;
      const b = Math.floor(Math.random() * (40 - (a % 10)));
      return { pregunta: `¿Cuánto es ${a} + ${b}?`, respuesta: (a + b).toString() };
    }
  }
};

// Ruta para generar preguntas aleatorias
app.get("/preguntas", (req, res) => {
  const { curso, tema, subtipo = "mixto" } = req.query;
  if (curso !== "1primaria" || !temasPrimaria1[tema]) {
    return res.status(400).json({ error: "Curso o tema no válido" });
  }
  const genObj = temasPrimaria1[tema];
  const subtemas = Object.keys(genObj);
  const preguntas = [];
  const usados = new Set();
  while (preguntas.length < 10) {
    const elegido = subtipo === "mixto" ? subtemas[Math.floor(Math.random() * subtemas.length)] : subtipo;
    if (!genObj[elegido]) break;
    const p = genObj[elegido]();
    const key = JSON.stringify(p);
    if (!usados.has(key)) {
      usados.add(key);
      preguntas.push(p);
    }
  }
  res.json(preguntas);
});

// Iniciar servidor
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor iniciado en puerto ${port}`));

