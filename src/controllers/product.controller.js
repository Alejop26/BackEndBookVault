const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
    const q = {};
    if (search) q.$text = { $search: search };
    if (category && category !== 'all') q.category = category;
    if (minPrice || maxPrice) {
      q.price = {};
      if (minPrice) q.price.$gte = +minPrice;
      if (maxPrice) q.price.$lte = +maxPrice;
    }
    const sorts = {
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      rating: { rating: -1 },
      newest: { createdAt: -1 },
    };
    const skip = (+page - 1) * +limit;
    const [products, total] = await Promise.all([
      Product.find(q).sort(sorts[sort] || { bestseller: -1, rating: -1 }).skip(skip).limit(+limit),
      Product.countDocuments(q),
    ]);
    res.json({ products, total, page: +page, pages: Math.ceil(total / +limit) });
  } catch (e) { next(e); }
};

exports.getProduct = async (req, res, next) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'No encontrado' });
    res.json(p);
  } catch (e) { next(e); }
};

exports.createProduct = async (req, res, next) => {
  try { res.status(201).json(await Product.create(req.body)); }
  catch (e) { next(e); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!p) return res.status(404).json({ message: 'No encontrado' });
    res.json(p);
  } catch (e) { next(e); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Eliminado' });
  } catch (e) { next(e); }
};
