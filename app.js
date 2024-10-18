// 1. Requerir el módulo express
const express = require('express');

// 2. Crear una instancia de la aplicación Express
const app = express();

// 3. Importar las rutas para los juegos
const juegosRouter = require('./routes/juegos');

// 4. Middleware para parsear JSON en las solicitudes
app.use(express.json()); // Esto permite que la app lea datos JSON

// 5. Usar las rutas de juegos, accesibles desde /juegos
app.use('/juegos', juegosRouter); // Rutas definidas en juegosRouter se servirán bajo /juegos

// 6. Definir el puerto donde escuchará el servidor
const PORT = process.env.PORT || 3000; // Usa el puerto definido en variables de entorno o 3000 por defecto

// 7. Iniciar el servidor y mostrar un mensaje en consola
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`); // Mensaje de confirmación en consola
});
