import express from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

// Crear nueva orden
router.post('/',
  verificarToken,
  [
    body('juegos').isArray(),
    body('metodoPago').notEmpty()
  ],
  async (req, res) => {
    try {
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
      }

      const orden = new Order({
        ...req.body,
        usuario: req.usuario.id
      });

      await orden.save();
      
      // Simular recibo
      const recibo = {
        numeroOrden: orden.numeroOrden,
        fecha: orden.fecha,
        total: orden.total,
        juegos: orden.juegos,
        metodoPago: orden.metodoPago
      };

      res.status(201).json({ orden, recibo });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error creando la orden' });
    }
});

// Obtener órdenes del usuario
router.get('/mis-ordenes',
  verificarToken,
  async (req, res) => {
    try {
      const ordenes = await Order.find({ usuario: req.usuario.id })
        .populate('juegos.juego')
        .sort({ fecha: -1 });
      res.json(ordenes);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error obteniendo órdenes' });
    }
});