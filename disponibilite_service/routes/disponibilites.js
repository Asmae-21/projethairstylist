const express = require('express');
const authenticateJWT = require('../middleware/auth');

module.exports = (prisma) => {
  const router = express.Router();

  // GET /disponibilites - return all available slots (is_reserved: false)
  router.get('/', async (req, res) => {
    try {
      const slots = await prisma.disponibilite.findMany({
        where: { is_reserved: false },
      });
      res.json(slots);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  // POST /disponibilites - admin only, add new slot
  router.post('/', authenticateJWT, (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  }, async (req, res) => {
    console.log('req.user in POST /disponibilites:', req.user); // Debug log
    const { date, heure } = req.body;
    if (!date || !heure) {
      return res.status(400).json({ error: 'date and heure are required' });
    }
    try {
      const newSlot = await prisma.disponibilite.create({
        data: { date, heure, is_reserved: false },
      });
      res.status(201).json(newSlot);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
}; 