const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',         require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/alerts',       require('./routes/alerts'));
app.use('/api/reports',      require('./routes/reports'));
app.use('/api/admin',        require('./routes/admin'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`EcoShield running on port ${PORT}`));
