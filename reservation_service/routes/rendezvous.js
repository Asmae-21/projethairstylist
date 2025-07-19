const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

module.exports = (prisma) => {
  // Get user's reservations
  router.get('/', auth, async (req, res) => {
    try {
      const reservations = await prisma.reservation.findMany({
        where: { utilisateur_id: req.user.id },
        include: { Disponibilite: true },
        orderBy: { date: 'asc' }
      });
      res.json(reservations);
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });

  // Book a reservation
  router.post('/', auth, async (req, res) => {
    const { date, heure, service, disponibilite_id } = req.body;
    const utilisateur_id = req.user.id; // Changed from userId to id to match auth middleware
    if (!date || !heure || !service || !disponibilite_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Check if slot is already reserved
    const slot = await prisma.disponibilite.findUnique({ where: { id: disponibilite_id } });
    if (!slot || slot.is_reserved) {
      return res.status(409).json({ error: 'Time slot already reserved' });
    }
    try {
      const reservation = await prisma.reservation.create({
        data: {
          date: new Date(date),
          heure,
          service,
          utilisateur_id,
          disponibilite_id,
        },
      });
      await prisma.disponibilite.update({
        where: { id: disponibilite_id },
        data: { is_reserved: true },
      });
      res.status(201).json(reservation);
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });

  // View reservation by ID
  router.get('/:id', auth, async (req, res) => {
    try {
      const reservation = await prisma.reservation.findUnique({
        where: { id: parseInt(req.params.id) },
      });
      if (!reservation) return res.status(404).json({ error: 'Not found' });
      res.json(reservation);
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });

  // Modify reservation
  router.put('/:id', auth, async (req, res) => {
    const { date, heure, service, disponibilite_id } = req.body;
    try {
      const updated = await prisma.reservation.update({
        where: { id: parseInt(req.params.id) },
        data: { date: new Date(date), heure, service, disponibilite_id },
      });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });

  // Cancel reservation
  router.delete('/:id', auth, async (req, res) => {
    try {
      const reservation = await prisma.reservation.delete({
        where: { id: parseInt(req.params.id) },
      });
      // Free up the slot
      await prisma.disponibilite.update({
        where: { id: reservation.disponibilite_id },
        data: { is_reserved: false },
      });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });

  return router;
};
