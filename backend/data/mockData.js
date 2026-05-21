const { v4: uuidv4 } = require('uuid');

const users = [
  {
    id: 'user_001',
    name: 'Tendai Moyo',
    phone: '+263 77 123 4567',
    email: 'tendai@ecocash.co.zw',
    password: 'password123',
    role: 'user',
    balance: 1240.50,
    accountStatus: 'active',
    cardType: 'Econet Visa',
    cardNumber: '**** **** **** 4832',
    cardExpiry: '09/28',
    joinDate: '2023-03-15',
  },
  {
    id: 'admin_001',
    name: 'Rumbi Chikwanda',
    phone: '+263 78 999 0001',
    email: 'admin@ecoshield.co.zw',
    password: 'admin123',
    role: 'admin',
    balance: 0,
    accountStatus: 'active',
    cardType: null,
    cardNumber: null,
    cardExpiry: null,
    joinDate: '2022-01-01',
  }
];

// New users registered via signup are stored here at runtime
const registeredUsers = [];

function addUser(userData) {
  const newUser = {
    id: uuidv4(),
    name: userData.fullName,
    phone: userData.ecocashNumber,
    email: userData.email,
    password: userData.password,
    role: 'user',
    balance: 0.00,
    accountStatus: 'active',
    cardType: 'Econet Visa',
    cardNumber: '**** **** **** ' + userData.cardNumber.replace(/\s/g, '').slice(-4),
    cardExpiry: '12/28',
    joinDate: new Date().toISOString().split('T')[0],
  };
  registeredUsers.push(newUser);
  return newUser;
}

function findUser(phone, password) {
  return [...users, ...registeredUsers].find(u => u.phone === phone && u.password === password);
}

function phoneExists(phone) {
  return [...users, ...registeredUsers].some(u => u.phone === phone);
}

const transactions = [
  { id: uuidv4(), userId: 'user_001', type: 'purchase',  amount: 850.00, currency: 'USD', merchant: 'Unknown Merchant',  location: 'Unknown Location', timestamp: new Date(Date.now() - 1*3600000).toISOString(),  status: 'blocked',   fraudScore: 91, isFlagged: true,  riskLevel: 'critical' },
  { id: uuidv4(), userId: 'user_001', type: 'pay_bill',  amount: 45.00,  currency: 'USD', merchant: 'ZESA',              location: 'Harare CBD',       timestamp: new Date(Date.now() - 2*3600000).toISOString(),  status: 'completed', fraudScore: 4,  isFlagged: false, riskLevel: 'low'      },
  { id: uuidv4(), userId: 'user_001', type: 'purchase',  amount: 199.99, currency: 'USD', merchant: 'Unknown Merchant',  location: 'Bulawayo',         timestamp: new Date(Date.now() - 5*3600000).toISOString(),  status: 'flagged',   fraudScore: 67, isFlagged: true,  riskLevel: 'high'     },
  { id: uuidv4(), userId: 'user_001', type: 'purchase',  amount: 25.50,  currency: 'USD', merchant: 'Chicken Inn',       location: 'Harare CBD',       timestamp: new Date(Date.now() - 6*3600000).toISOString(),  status: 'completed', fraudScore: 6,  isFlagged: false, riskLevel: 'low'      },
  { id: uuidv4(), userId: 'user_001', type: 'purchase',  amount: 75.00,  currency: 'USD', merchant: 'Econet Visa POS',  location: 'Harare CBD',       timestamp: new Date(Date.now() - 8*3600000).toISOString(),  status: 'completed', fraudScore: 3,  isFlagged: false, riskLevel: 'low'      },
  { id: uuidv4(), userId: 'user_001', type: 'purchase',  amount: 730.00, currency: 'USD', merchant: 'Unknown Merchant',  location: 'Unknown Location', timestamp: new Date(Date.now() - 10*3600000).toISOString(), status: 'blocked',   fraudScore: 88, isFlagged: true,  riskLevel: 'critical' },
  { id: uuidv4(), userId: 'user_001', type: 'pay_bill',  amount: 120.00, currency: 'USD', merchant: 'OK Zimbabwe',       location: 'Harare CBD',       timestamp: new Date(Date.now() - 12*3600000).toISOString(), status: 'completed', fraudScore: 5,  isFlagged: false, riskLevel: 'low'      },
  { id: uuidv4(), userId: 'user_001', type: 'purchase',  amount: 340.00, currency: 'USD', merchant: 'Unknown Merchant',  location: 'Mutare',           timestamp: new Date(Date.now() - 24*3600000).toISOString(), status: 'flagged',   fraudScore: 55, isFlagged: true,  riskLevel: 'high'     },
  { id: uuidv4(), userId: 'user_001', type: 'purchase',  amount: 18.00,  currency: 'USD', merchant: 'Clicks Zimbabwe',   location: 'Bulawayo',         timestamp: new Date(Date.now() - 26*3600000).toISOString(), status: 'completed', fraudScore: 7,  isFlagged: false, riskLevel: 'low'      },
  { id: uuidv4(), userId: 'user_001', type: 'purchase',  amount: 60.00,  currency: 'USD', merchant: 'TM Pick n Pay',    location: 'Harare CBD',       timestamp: new Date(Date.now() - 30*3600000).toISOString(), status: 'completed', fraudScore: 9,  isFlagged: false, riskLevel: 'low'      },
];

const alerts = [
  { id: uuidv4(), userId: 'user_001', type: 'high_risk', title: 'Transaction Blocked',         message: 'A $850.00 purchase at an unknown merchant was automatically blocked due to a critical fraud score of 91/100.', timestamp: new Date(Date.now() - 1*3600000).toISOString(),  isRead: false, severity: 'critical' },
  { id: uuidv4(), userId: 'user_001', type: 'warning',   title: 'Suspicious Activity Flagged', message: 'A $199.99 transaction from Bulawayo has been flagged for review. Please verify this was you.',                 timestamp: new Date(Date.now() - 5*3600000).toISOString(),  isRead: false, severity: 'warning'  },
  { id: uuidv4(), userId: 'user_001', type: 'info',      title: 'New Device Login',            message: 'Your Econet Visa account was accessed from a new device. Contact support if this was not you.',               timestamp: new Date(Date.now() - 24*3600000).toISOString(), isRead: true,  severity: 'info'     },
  { id: uuidv4(), userId: 'user_001', type: 'high_risk', title: 'Transaction Blocked',         message: 'A $730.00 transaction to an unknown location was blocked. Fraud score: 88/100.',                              timestamp: new Date(Date.now() - 10*3600000).toISOString(), isRead: true,  severity: 'critical' },
];

module.exports = { users, registeredUsers, transactions, alerts, addUser, findUser, phoneExists };
