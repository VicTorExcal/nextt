const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use((err, req, res, next) => {
  if (err instanceof Error) {
    // Si es un objeto Error, muestra el mensaje y el stack trace
    console.error("MULTER/CLOUDINARY ERROR:", err.message);
    console.error("STACK TRACE:", err.stack);
  } else {
    // Si no es un objeto Error, usa console.dir para ver la estructura
    console.error("MULTER/CLOUDINARY ERROR:", err);
    console.dir(err, { depth: null }); // Profundiza al máximo en el objeto
  }

  res.status(500).json({ error: err.message || 'Error desconocido' });
});

const genericRoutes = require('./routes/genericRoutes');
const authRoutes = require('./routes/authRoutes');

// Rutas
app.use("/api/crud", genericRoutes);
app.use('/api', genericRoutes);
app.use('/auth', authRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});


