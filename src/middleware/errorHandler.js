module.exports = (err, req, res, next) => {
  console.error(err.stack);
  if (err.name === 'ValidationError') {
    const msgs = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: msgs.join(', ') });
  }
  if (err.code === 11000)
    return res.status(400).json({ message: 'El email ya está registrado' });
  res.status(err.statusCode || 500).json({ message: err.message || 'Error del servidor' });
};
