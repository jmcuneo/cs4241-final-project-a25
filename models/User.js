import mongoose from 'mongoose'

const { Schema, model } = mongoose

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, {collection: 'users'})

export default model('User', userSchema)
