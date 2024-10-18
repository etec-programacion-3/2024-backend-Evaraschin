const express = require('express');
const router = express.Router();
const db = require('../database');  // Importar conexión SQLite

// Crear un juego
router.post('/', (req, res) => {
  const { nombre, precio, plataforma, stock, categoria, fecha_lanzamiento, desarrollador } = req.body;
  const query = `INSERT INTO juegos (nombre, precio, plataforma, stock, categoria, fecha_lanzamiento, desarrollador)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(query, [nombre, precio, plataforma, stock, categoria, fecha_lanzamiento, desarrollador], function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(201).send({ id: this.lastID, ...req.body });
  });
});

// Obtener todos los juegos
router.get('/', (req, res) => {
  const query = `SELECT * FROM juegos`;
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send(rows);
  });
});

// Editar un juego
router.put('/:id', (req, res) => {
  const { nombre, precio, plataforma, stock, categoria, fecha_lanzamiento, desarrollador } = req.body;
  const query = `UPDATE juegos SET nombre = ?, precio = ?, plataforma = ?, stock = ?, categoria = ?, fecha_lanzamiento = ?, desarrollador = ?
                 WHERE id = ?`;
  db.run(query, [nombre, precio, plataforma, stock, categoria, fecha_lanzamiento, desarrollador, req.params.id], function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send({ id: req.params.id, ...req.body });
  });
});

// Eliminar un juego
router.delete('/:id', (req, res) => {
  const query = `DELETE FROM juegos WHERE id = ?`;
  db.run(query, [req.params.id], function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(204).send();
  });
});

module.exports = router;
