const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const c = require('../controllers/user.controller');

router.get('/cart', protect, c.getCart);
router.post('/cart', protect, c.addToCart);
router.post('/cart/sync', protect, c.syncCart);
router.put('/cart/:productId', protect, c.updateCartItem);
router.delete('/cart/:productId', protect, c.removeFromCart);
router.delete('/cart', protect, c.clearCart);
router.put('/profile', protect, c.updateProfile);
router.get('/', protect, adminOnly, c.getAllUsers);

module.exports = router;
