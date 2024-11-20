const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_seguro';

exports.register = (req, res) => {
  const { username, email, password } = req.body;

  // Encriptar contraseña
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  
  db.run(query, [username, email, hashedPassword], function(err) {
    if (err) {
      return res.status(400).json({ error: 'Error al registrar usuario' });
    }
    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: this.lastID });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  });
};

