import express from "express";
import ViteExpress from "vite-express";
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from './models/User.js'
import UserData from './models/UserData.js'
import fs from 'fs';
import seedrandom from 'seedrandom';

dotenv.config()

const app = express();

app.use(express.json())

// connect to MongoDB
const builtFromParts = (process.env.MONGO_USER && process.env.MONGO_PASS && process.env.MONGO_HOST && process.env.MONGO_DB)
  ? `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  : ''
const mongoUri = process.env.MONGO_URI || builtFromParts
if (mongoUri) {
  mongoose.connect(mongoUri, {
  }).then(() => {
    console.log('Connected to MongoDB')
  }).catch(err => {
    console.error('MongoDB connection error:', err)
  })
} else {
  console.warn('No MongoDB connection string found')
}

// POST /login - authenticate user and return JWT on success
app.post('/login', async (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password) return res.status(400).json({ success: false, message: 'username and password required' })
  if (!mongoUri) return res.status(503).json({ success: false, message: 'Database is not configured' })

  try {
    const user = await User.findOne({ username }).exec()

    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' })

    const secret = process.env.JWT_SECRET || 'dev_jwt_secret'
    const token = jwt.sign({ id: user._id.toString(), username: user.username }, secret, { expiresIn: '2h' })

    return res.json({ success: true, token, user: { username: user.username } })
  } catch (err) {
    console.error('Login error', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

// POST /register - create a new user and return JWT on success
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body || {}
    if (!username || !password) return res.status(400).json({ success: false, message: 'username and password required' })
    if (typeof username !== 'string' || typeof password !== 'string') return res.status(400).json({ success: false, message: 'invalid payload' })
    if (username.length < 3) return res.status(400).json({ success: false, message: 'username must be at least 3 characters' })
    if (password.length < 4) return res.status(400).json({ success: false, message: 'password must be at least 4 characters' })

    // ensure that DB is connected
    if (!mongoUri) return res.status(503).json({ success: false, message: 'Database is not configured' })

    const existing = await User.findOne({ username }).exec()
    if (existing) return res.status(409).json({ success: false, message: 'username already taken' })

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({ username, passwordHash })
    await user.save()

    const userData = new UserData( { userId: user._id, playedGames: 0, wonGames: 0, currentStreak: 0, lastUpdated: Date.now() } )
    await userData.save()

    const secret = process.env.JWT_SECRET || 'dev_jwt_secret'
    const token = jwt.sign({ id: user._id.toString(), username: user.username }, secret, { expiresIn: '2h' })

    return res.status(201).json({ success: true, token, user: { username: user.username } })
  } catch (err) {
    console.error('Register error', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
})

// GET /me - returns current user when provided a Bearer token
app.get('/me', async (req, res) => {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Missing token' })
  const token = auth.slice(7)
  const secret = process.env.JWT_SECRET || 'dev_jwt_secret'
  try {
    const payload = jwt.verify(token, secret)
    // payload needs an id and username
    const user = await User.findById(payload.id).exec()
    if (!user) return res.status(401).json({ success: false, message: 'Invalid token' })
    return res.json({ success: true, user: { username: user.username } })
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
})

app.get('/userData', async (req, res) => {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Missing token' })
  const token = auth.slice(7)
  const secret = process.env.JWT_SECRET || 'dev_jwt_secret'

  try {
    const payload = jwt.verify(token, secret)
    // payload needs an id and username
    const user = await User.findById(payload.id).exec()
    if (!user) return res.status(401).json({ success: false, message: 'Invalid token' })

    // fetch the user's data
    const data = await UserData.findOne({ userId: user._id }).exec()
    if(data) {
      return res.json({ playedGames: data.playedGames, wonGames: data.wonGames, currentStreak: data.currentStreak, lastUpdated: data.lastUpdated })
    }
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
})

app.post('/UpdateUserData', async (req, res) => {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Missing token' })
  const token = auth.slice(7)
  const secret = process.env.JWT_SECRET || 'dev_jwt_secret'

  try {
    const payload = jwt.verify(token, secret)
    // payload needs an id and username
    const user = await User.findById(payload.id).exec()
    if (!user) return res.status(401).json({ success: false, message: 'Invalid token' })

    // fetch the user's data
    const data = await UserData.findOne({ userId: user._id }).exec()
    if(data) {
      const lastUpdated = data.lastUpdated;
      const current = new Date();
      const sameDay = lastUpdated.getFullYear() === now.getFullYear() &&
          lastUpdated.getMonth() === now.getMonth() &&
          lastUpdated.getDate() === now.getDate();

      if (sameDay) {
        return res.status(429).json({ success: false, message: 'Already updated today' });
      }

      // checking if streak has been broken
      const lastMidnight = new Date(lastUpdated.getFullYear(), lastUpdated.getMonth(), lastUpdated.getDate());
      const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const msPerDay = 24 * 60 * 60 * 1000;
      const diffDays = (nowMidnight - lastMidnight) / msPerDay;

      let streak = data.currentStreak;
      if(diffDays > 2) {
        streak = 0;
      } else {
        streak += 1
      }

      let wonGames = data.wonGames;
      if(req.body.won === true) {
        wonGames += 1;
      }
      await UserData.updateOne({ userId: user._id }, {
        playedGames: data.playedGames += 1,
        wonGames: wonGames,
        currentStreak: streak,
        lastUpdated: current
      }).exec();

      return res.json({ success: true, message: 'UserData updated' });


    }
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
})

// Removed passport.js alternative approach; sticking with JWT-only auth for simplicity because there were issues with session handling


// Word Setting
const text = fs.readFileSync('wordList.txt', 'utf8')
const words = text.split(/\s+/).filter(Boolean)

const now = new Date()
const seed = parseInt(`${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`, 10)

const rand = seedrandom(seed)
const index = Math.floor(rand() * words.length)
const chosenWord = words[index].toUpperCase()

console.log(`Seed: ${seed}`)
console.log(`Random word: ${chosenWord}`)

// Guess Handling

app.post('/guess', (req, res) => {
  const {word} = req.body

  if(!word || word.length !== 8) {
    return res.status(400).json({error: 'Word must be 8 letters'})
  }

  const feedback = word.split('').map((letter, i) => {
    console.log('Current letter:', letter, 'at index', i)
    if (letter === chosenWord[i]) {
      console.log('1')
      return 1
    } else if (chosenWord.includes(letter)) {
      console.log('0')
      return 0
    } else {
      console.log('-1')
      return -1
    }
  })

  res.json({feedback})
})

app.post('/valid', (req, res) => {
  const {word} = req.body

  if(!word || word.length !== 8) {
    return res.status(400).json({error: 'Word must be 8 letters'})
  }

  let feedback = false

  if (words.includes(word.trim().toLowerCase())) {
    feedback = true
  }

  res.json({feedback})
})

ViteExpress.listen(app, process.env.PORT || 3000, () =>
  console.log("Server is listening on port 3000..."),
);
