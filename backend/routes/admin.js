const router = require('express').Router();
const { transactions, users, alerts } = require('../data/mockData');

router.get('/overview', (req, res) => {
  res.json({
    totalUsers:   users.filter(u => u.role === 'user').length,
    totalTx:      transactions.length,
    flaggedTx:    transactions.filter(t => t.isFlagged).length,
    blockedTx:    transactions.filter(t => t.status === 'blocked').length,
    amountSaved:  transactions.filter(t => t.status === 'blocked').reduce((s, t) => s + t.amount, 0).toFixed(2),
    unreadAlerts: alerts.filter(a => !a.isRead).length,
  });
});

router.get('/transactions', (req, res) => {
  res.json(transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
});

router.patch('/transactions/:id/approve', (req, res) => {
  const tx = transactions.find(t => t.id === req.params.id);
  if (!tx) return res.status(404).json({ error: 'Not found' });
  tx.status = 'completed'; tx.isFlagged = false;
  res.json(tx);
});

router.patch('/transactions/:id/block', (req, res) => {
  const tx = transactions.find(t => t.id === req.params.id);
  if (!tx) return res.status(404).json({ error: 'Not found' });
  tx.status = 'blocked'; tx.isFlagged = true;
  res.json(tx);
});

module.exports = router;
