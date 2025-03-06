const { checkApiKey } = require("./middleware/auth")
const v1Router = require("./api/v1/router/general")
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require("cors")

//Control de CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'https://viajaconmia.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
};

//Manejo de req
app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store'); // Evita el almacenamiento en caché
  res.set('Pragma', 'no-cache');        // Para compatibilidad con HTTP/1.0
  res.set('Expires', '0');              // Establece que la fecha de expiración ya pasó
  next(); // Pasa al siguiente middleware o ruta
});

//Manejo de rutas
app.use("/v1", checkApiKey, (req, res, next) => {
  res.setHeader("Cache-Control", "no-cache");
  next();
}, v1Router)
app.get('/', (req, res) => res.json({ mensaje: 'Bienvenido a la API. Por favor, autentícate para acceder a más datos.' }));

// Middleware para manejar errores globales
app.use((err, req, res, next) => {
  console.log(err.response.data)
  res.status(500).json({
    error: true,
    mensaje: err.message || 'Ocurrió un error interno en el servidor',
    data: err.response.data
  });
});
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
