#!/usr/bin/env node
import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'

const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL || process.env.MONGO_CONNECTION_STRING
if (!mongoUri) {
  console.error('Please set MONGO_URI in your .env')
  process.exit(1)
}

async function run() {
  await mongoose.connect(mongoUri)
  const username = process.env.SEED_USERNAME || 'tester'
  const password = process.env.SEED_PASSWORD || 'password123'

  const existing = await User.findOne({ username })
  if (existing) {
    console.log('User already exists:', username)
    process.exit(0)
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const u = new User({ username, passwordHash: hash })
  await u.save()
  console.log('Created user', username, 'with password', password)
  process.exit(0)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
