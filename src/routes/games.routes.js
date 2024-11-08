const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/games.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', gamesController.getAllGames);
router.get('/:id', gamesController.getGameById);

module.exports = router;