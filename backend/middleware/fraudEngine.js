function scoreFraud(tx) {
  let score = 0;
  if (tx.amount > 500)      score += 35;
  else if (tx.amount > 200) score += 15;
  if (tx.merchant === 'Unknown Merchant')  score += 30;
  if (tx.location === 'Unknown Location')  score += 25;
  const hour = new Date(tx.timestamp).getHours();
  if (hour >= 0 && hour <= 5) score += 20;
  return Math.min(score, 100);
}

function classifyRisk(score) {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

module.exports = { scoreFraud, classifyRisk };
