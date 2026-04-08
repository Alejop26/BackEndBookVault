const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: null },
    cover: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Fiction', 'Fantasy', 'Sci-Fi', 'Mystery', 'Romance',
        'Technology', 'Business', 'Self-Help', 'History',
        'Classic', 'Biography', 'Science',
      ],
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    stock: { type: Number, default: 20, min: 0 },
    pages: { type: Number },
    bookLanguage: { type: String, default: 'Español' },
    publisher: { type: String },
    publishedYear: { type: Number },
    tags: [String],
    featured: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    newRelease: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', author: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
