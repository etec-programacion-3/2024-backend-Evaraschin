const { db } = require('../database/db');

exports.getAllGames = (req, res) => {
  db.all('SELECT * FROM games', [], (err, games) => {
    if (err) {
      return res.status(400).json({ error: 'Error al obtener juegos' });
    }
    res.json(games);
  });
};

exports.getGameById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM games WHERE id = ?', [id], (err, game) => {
    if (err) {
      return res.status(400).json({ error: 'Error al obtener el juego' });
    }
    if (!game) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }
    res.json(game);
  });
};