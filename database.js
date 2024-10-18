const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Crear tabla de juegos
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS juegos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    precio REAL NOT NULL,
    plataforma TEXT NOT NULL,
    stock INTEGER NOT NULL,
    categoria TEXT NOT NULL,
    fecha_lanzamiento TEXT NOT NULL,
    desarrollador TEXT NOT NULL
  )`);

  // Array de juegos a insertar
  const juegos = [
    {
      nombre: 'Red Dead Redemption',
      precio: 29.99,
      plataforma: 'PS4',
      stock: 100,
      categoria: 'Aventura',
      fecha_lanzamiento: '2010-05-18',
      desarrollador: 'Rockstar Games',
    },
    {
      nombre: 'GTA V',
      precio: 39.99,
      plataforma: 'PS4, Xbox One, PC',
      stock: 150,
      categoria: 'Acción',
      fecha_lanzamiento: '2013-09-17',
      desarrollador: 'Rockstar North',
    },
    {
      nombre: 'Minecraft',
      precio: 26.95,
      plataforma: 'PC, PS4, Xbox One, Nintendo Switch',
      stock: 200,
      categoria: 'Supervivencia',
      fecha_lanzamiento: '2011-11-18',
      desarrollador: 'Mojang Studios',
    },
    {
      nombre: 'God of War',
      precio: 19.99,
      plataforma: 'PS4',
      stock: 80,
      categoria: 'Acción/Aventura',
      fecha_lanzamiento: '2018-04-20',
      desarrollador: 'Santa Monica Studio',
    },
    {
      nombre: 'EA FC 25',
      precio: 69.99,
      plataforma: 'PS5, Xbox Series X/S',
      stock: 120,
      categoria: 'Deportes',
      fecha_lanzamiento: '2023-09-29',
      desarrollador: 'EA Sports',
    },
  ];

  // Insertar juegos en la base de datos
  juegos.forEach(juego => {
    const query = `INSERT INTO juegos (nombre, precio, plataforma, stock, categoria, fecha_lanzamiento, desarrollador) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(query, [juego.nombre, juego.precio, juego.plataforma, juego.stock, juego.categoria, juego.fecha_lanzamiento, juego.desarrollador], function(err) {
      if (err) {
        console.error('Error al insertar juego:', juego.nombre, err.message);
      } else {
        console.log(`Juego insertado: ${juego.nombre} con ID ${this.lastID}`);
      }
    });
  });
});

// Cerrar la base de datos al finalizar
db.close();
