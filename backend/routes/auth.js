const router = require('express').Router();
const { findUser, addUser, phoneExists } = require('../data/mockData');

// Login
router.post('/login', (req, res) => {
  const { phone, password } = req.body;
  const user = findUser(phone, password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const { password: _, ...safe } = user;
  res.json({ user: safe, token: 'mock-token-' + user.id });
});

// Register
router.post('/register', (req, res) => {
  const { ecocashNumber, password, fullName, email, cardNumber, accountHolder } = req.body;
  if (!ecocashNumber || !password || !fullName || !cardNumber || !accountHolder) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (phoneExists(ecocashNumber)) {
    return res.status(409).json({ error: 'An account with this EcoCash number already exists' });
  }
  const newUser = addUser({ fullName, ecocashNumber, email, password, cardNumber, accountHolder });
  const { password: _, ...safe } = newUser;
  res.status(201).json({ user: safe, token: 'mock-token-' + newUser.id });
});

router.get('/me', (req, res) => {
  res.json({ message: 'ok' });
});

module.exports = router;
