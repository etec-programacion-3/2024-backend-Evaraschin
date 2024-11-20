const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const User = require('../models/User');

// Obtener wishlist
router.get('/wishlist', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .populate('wishlist');
        
        if (!user) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json(user.wishlist);
    } catch (error) {
        console.error('Error al obtener wishlist:', error);
        res.status(500).json({ mensaje: 'Error al obtener wishlist' });
    }
});

// Agregar/Remover de wishlist
router.post('/wishlist/:gameId', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const gameId = req.params.gameId;
        const index = user.wishlist.indexOf(gameId);

        if (index > -1) {
            // Remover de wishlist
            user.wishlist.splice(index, 1);
            await user.save();
            res.json({ 
                mensaje: 'Juego removido de wishlist',
                wishlist: user.wishlist 
            });
        } else {
            // Agregar a wishlist
            user.wishlist.push(gameId);
            await user.save();
            res.json({ 
                mensaje: 'Juego agregado a wishlist',
                wishlist: user.wishlist 
            });
        }
    } catch (error) {
        console.error('Error al actualizar wishlist:', error);
        res.status(500).json({ mensaje: 'Error al actualizar wishlist' });
    }
});

// Obtener carrito
router.get('/cart', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .populate('cart.game');
        
        if (!user) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json(user.cart);
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).json({ mensaje: 'Error al obtener carrito' });
    }
});

// Agregar/Actualizar item en carrito
router.post('/cart', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const { gameId, quantity } = req.body;

        if (!gameId || !quantity || quantity < 1) {
            return res.status(400).json({ 
                mensaje: 'GameId y quantity (mínimo 1) son requeridos' 
            });
        }

        const cartItem = user.cart.find(item => 
            item.game.toString() === gameId
        );

        if (cartItem) {
            cartItem.quantity = quantity;
        } else {
            user.cart.push({ game: gameId, quantity });
        }

        await user.save();
        
        // Poblar el carrito antes de enviar la respuesta
        const updatedUser = await User.findById(req.userId)
            .populate('cart.game');

        res.json({ 
            mensaje: 'Carrito actualizado',
            cart: updatedUser.cart 
        });
    } catch (error) {
        console.error('Error al actualizar carrito:', error);
        res.status(500).json({ mensaje: 'Error al actualizar carrito' });
    }
});

// Remover del carrito
router.delete('/cart/:gameId', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        user.cart = user.cart.filter(item => 
            item.game.toString() !== req.params.gameId
        );
        
        await user.save();
        res.json({ 
            mensaje: 'Item removido del carrito',
            cart: user.cart 
        });
    } catch (error) {
        console.error('Error al remover del carrito:', error);
        res.status(500).json({ mensaje: 'Error al remover del carrito' });
    }
});

module.exports = router;