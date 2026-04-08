require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');


connectDB();
const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));

// Rate limit general
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: { message: 'Demasiadas peticiones, intenta más tarde' },
}));

// Rate limit estricto en auth (10 intentos / 15 min)
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Demasiados intentos, espera 15 minutos' },
}));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/users', require('./routes/user.routes'));

app.get('/api/health', (_, res) => res.json({ status: 'OK', env: process.env.NODE_ENV }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT} — modo ${process.env.NODE_ENV}`));
