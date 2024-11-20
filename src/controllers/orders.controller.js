const { db } = require('../database/db');

exports.createOrder = (req, res) => {
  const { userId, games } = req.body;
  const totalAmount = games.reduce((sum, game) => sum + (game.price * game.quantity), 0);

  db.run('BEGIN TRANSACTION');

  db.run('INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
    [userId, totalAmount],
    function(err) {
      if (err) {
        db.run('ROLLBACK');
        return res.status(400).json({ error: 'Error al crear la orden' });
      }

      const orderId = this.lastID;
      const stmt = db.prepare('INSERT INTO order_details (order_id, game_id, quantity, price) VALUES (?, ?, ?, ?)');
      
      games.forEach(game => {
        stmt.run([orderId, game.id, game.quantity, game.price]);
      });
      
      stmt.finalize();
      db.run('COMMIT');
      
      res.status(201).json({ 
        message: 'Orden creada exitosamente', 
        orderId, 
        totalAmount 
      });
    }
  );
};

exports.getOrdersByUser = (req, res) => {
  const { userId } = req.params;

  db.all(`
    SELECT o.*, od.game_id, od.quantity, od.price, g.title
    FROM orders o
    JOIN order_details od ON o.id = od.order_id
    JOIN games g ON od.game_id = g.id
    WHERE o.user_id = ?
  `, [userId], (err, orders) => {
    if (err) {
      return res.status(400).json({ error: 'Error al obtener órdenes' });
    }
    res.json(orders);
  });
};