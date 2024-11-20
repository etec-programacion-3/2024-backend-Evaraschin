import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Registro
router.post('/registro',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('nombre').trim().notEmpty()
  ],
  async (req, res) => {
    try {
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
      }

      const { email, password, nombre } = req.body;

      const usuarioExiste = await User.findOne({ email });
      if (usuarioExiste) {
        return res.status(400).json({ mensaje: 'El usuario ya existe' });
      }

      const usuario = new User({ email, password, nombre });
      await usuario.save();

      const token = jwt.sign(
        { id: usuario._id },
        process.env.JWT_SECRET || 'secreto',
        { expiresIn: '24h' }
      );

      res.status(201).json({ token });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

// Login
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    try {
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
      }

      const { email, password } = req.body;
      const usuario = await User.findOne({ email });

      if (!usuario || !(await usuario.compararPassword(password))) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
      }

      const token = jwt.sign(
        { id: usuario._id },
        process.env.JWT_SECRET || 'secreto',
        { expiresIn: '24h' }
      );

      res.json({ token });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});