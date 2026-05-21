const router = require('express').Router();
const { transactions } = require('../data/mockData');

router.get('/summary', (req, res) => {
  const byRisk = { low: 0, medium: 0, high: 0, critical: 0 };
  transactions.forEach(t => { if (byRisk[t.riskLevel] !== undefined) byRisk[t.riskLevel]++; });

  const byDay = {};
  transactions.forEach(t => {
    const day = t.timestamp.split('T')[0];
    if (!byDay[day]) byDay[day] = { date: day, total: 0, flagged: 0, amount: 0 };
    byDay[day].total++;
    if (t.isFlagged) byDay[day].flagged++;
    byDay[day].amount += t.amount;
  });

  res.json({
    byRisk,
    byDay: Object.values(byDay).sort((a, b) => a.date.localeCompare(b.date)),
    topMerchants: ['EcoCash Visa POS', 'OK Zimbabwe', 'ZESA', 'Chicken Inn', 'Unknown Merchant'],
  });
});

module.exports = router;
