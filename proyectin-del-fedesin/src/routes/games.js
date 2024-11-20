import express from 'express';
import { body, validationResult } from 'express-validator';
import Game from '../models/Game.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los juegos
router.get('/', async (req, res) => {
  try {
    const juegos = await Game.find();
    res.json(juegos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error obteniendo juegos' });
  }
});

// Obtener un juego específico
router.get('/:id', async (req, res) => {
  try {
    const juego = await Game.findById(req.params.id);
    if (!juego) {
      return res.status(404).json({ mensaje: 'Juego no encontrado' });
    }
    res.json(juego);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error obteniendo el juego' });
  }
});

// Crear nuevo juego (solo admin)
router.post('/',
  verificarToken,
  [
    body('titulo').trim().notEmpty(),
    body('descripcion').trim().notEmpty(),
    body('precio').isNumeric(),
    body('genero').trim().notEmpty(),
    body('plataforma').isArray()
  ],
  async (req, res) => {
    try {
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
      }

      const juego = new Game(req.body);
      await juego.save();
      res.status(201).json(juego);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error creando el juego' });
    }
});