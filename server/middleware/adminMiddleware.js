module.exports = function (req, res, next) {
  const adminEmail = process.env.ADMIN_EMAIL || 'owner@example.com';
  if (!req.userEmail || req.userEmail.toLowerCase().trim() !== adminEmail.toLowerCase().trim()) {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};
