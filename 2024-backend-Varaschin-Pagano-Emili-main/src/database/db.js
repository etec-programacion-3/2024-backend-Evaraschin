const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'videogames.db'));

function init() {
  db.serialize(() => {
    // Tabla de usuarios
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabla de juegos
    db.run(`CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      stock INTEGER DEFAULT 0
    )`);

    // Tabla de órdenes
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Tabla de detalles de orden
    db.run(`CREATE TABLE IF NOT EXISTS order_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      game_id INTEGER,
      quantity INTEGER,
      price REAL,
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(game_id) REFERENCES games(id)
    )`);

    // Insertar juegos iniciales
    const initialGames = [
      ['EA FC 24', 59.99, 'El último juego de fútbol de EA Sports', 100],
      ['Red Dead Redemption 2', 49.99, 'Aventura épica en el salvaje oeste', 50],
      ['Call of Duty Black Ops 3', 29.99, 'Acción militar futurista', 30],
      ['Fortnite', 0, 'Battle Royale gratuito', 999],
      ['GTA V', 29.99, 'Aventura de mundo abierto en Los Santos', 75],
      ['Valorant', 0, 'Shooter táctico 5v5', 999]
    ];

    const insert = db.prepare('INSERT OR IGNORE INTO games (title, price, description, stock) VALUES (?, ?, ?, ?)');
    initialGames.forEach(game => insert.run(game));
    insert.finalize();
  });
}

module.exports = {
  db,
  init
};