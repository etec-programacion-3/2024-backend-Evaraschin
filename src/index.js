const express = require('express');
const cors = require('cors');
const db = require('./database/db');
const authRoutes = require('./routes/auth.routes');
const gamesRoutes = require('./routes/games.routes');
const ordersRoutes = require('./routes/orders.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/orders', ordersRoutes);

// Inicializar base de datos
db.init();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});