const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sports-betting', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/bets', require('./routes/bets'));
app.use('/api/odds', require('./routes/odds'));

app.get('/', (req, res) => {
    res.json({ message: 'Sports Betting API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});