const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
// const authRoutes = require('./routes/auth');
// Comenta estas líneas hasta que crees los archivos correspondientes
// const gamesRoutes = require('./routes/games');
// const ordersRoutes = require('./routes/orders');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/gamestore', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => {
    console.error('Error conectando a MongoDB:', err);
    process.exit(1);
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({ mensaje: "¡Conexión exitosa con el backend!" });
});

// Rutas
// app.use('/api/auth', authRoutes);
// Comenta estas líneas hasta que crees los archivos correspondientes
// app.use('/api/games', gamesRoutes);
// app.use('/api/orders', ordersRoutes);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ mensaje: "Ruta no encontrada" });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        mensaje: "Error en el servidor",
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;