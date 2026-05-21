const router = require('express').Router();
const { alerts } = require('../data/mockData');

router.get('/', (req, res) => {
  const userId = req.query.userId || 'user_001';
  res.json(alerts.filter(a => a.userId === userId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
});

router.patch('/:id/read', (req, res) => {
  const alert = alerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Not found' });
  alert.isRead = true;
  res.json(alert);
});

module.exports = router;
