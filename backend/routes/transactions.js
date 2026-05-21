const router = require('express').Router();
const { transactions } = require('../data/mockData');
const { scoreFraud, classifyRisk } = require('../middleware/fraudEngine');

router.get('/', (req, res) => {
  const userId = req.query.userId || 'user_001';
  const result = transactions
    .filter(t => t.userId === userId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json(result);
});

router.get('/stats', (req, res) => {
  const total       = transactions.length;
  const flagged     = transactions.filter(t => t.isFlagged).length;
  const blocked     = transactions.filter(t => t.status === 'blocked').length;
  const totalAmount = transactions.reduce((s, t) => s + t.amount, 0).toFixed(2);
  const fraudRate   = ((flagged / total) * 100).toFixed(1);
  const saved       = transactions.filter(t => t.status === 'blocked').reduce((s, t) => s + t.amount, 0).toFixed(2);
  res.json({ total, flagged, blocked, totalAmount, fraudRate, saved });
});

router.post('/check', (req, res) => {
  const tx = req.body;
  const fraudScore = scoreFraud(tx);
  const riskLevel  = classifyRisk(fraudScore);
  const isFlagged  = fraudScore >= 50;
  const status     = fraudScore >= 75 ? 'blocked' : 'completed';
  res.json({ ...tx, fraudScore, riskLevel, isFlagged, status });
});

module.exports = router;
