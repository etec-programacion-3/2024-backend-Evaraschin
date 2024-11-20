const express = require('express');
const router = express.Router();

// Rutas de autenticación básicas
router.post('/register', (req, res) => {
    // Implementar registro
    res.json({ mensaje: "Ruta de registro" });
});

router.post('/login', (req, res) => {
    // Implementar login
    res.json({ mensaje: "Ruta de login" });
});

module.exports = router;
