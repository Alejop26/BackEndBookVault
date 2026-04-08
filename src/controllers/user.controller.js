const User = require('../models/User');

exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    res.json(user.cart.filter(i => i.product));
  } catch (e) { next(e); }
};

exports.syncCart = async (req, res, next) => {
  try {
    const { items } = req.body;
    const user = await User.findById(req.user.id);
    for (const item of items) {
      const ex = user.cart.find(i => i.product.toString() === item.productId);
      if (ex) ex.quantity += item.quantity;
      else user.cart.push({ product: item.productId, quantity: item.quantity });
    }
    await user.save();
    await user.populate('cart.product');
    res.json(user.cart.filter(i => i.product));
  } catch (e) { next(e); }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const user = await User.findById(req.user.id);
    const ex = user.cart.find(i => i.product.toString() === productId);
    if (ex) ex.quantity += quantity;
    else user.cart.push({ product: productId, quantity });
    await user.save();
    await user.populate('cart.product');
    res.json(user.cart.filter(i => i.product));
  } catch (e) { next(e); }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user.id);
    const item = user.cart.find(i => i.product.toString() === req.params.productId);
    if (item) item.quantity = quantity;
    await user.save();
    await user.populate('cart.product');
    res.json(user.cart.filter(i => i.product));
  } catch (e) { next(e); }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(i => i.product.toString() !== req.params.productId);
    await user.save();
    await user.populate('cart.product');
    res.json(user.cart.filter(i => i.product));
  } catch (e) { next(e); }
};

exports.clearCart = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { cart: [] });
    res.json([]);
  } catch (e) { next(e); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, avatar, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, avatar, bio },
      { new: true, runValidators: true }
    );
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, bio: user.bio });
  } catch (e) { next(e); }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (e) { next(e); }
};
