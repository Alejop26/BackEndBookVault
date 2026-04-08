const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const c = require('../controllers/product.controller');

router.get('/', c.getProducts);
router.get('/:id', c.getProduct);
router.post('/', protect, adminOnly, c.createProduct);
router.put('/:id', protect, adminOnly, c.updateProduct);
router.delete('/:id', protect, adminOnly, c.deleteProduct);

module.exports = router;
