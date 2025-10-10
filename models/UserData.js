import mongoose from 'mongoose'

const { Schema, model } = mongoose

const userDataSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    playedGames: { type: Number, required: true },
    wonGames: { type: Number, required: true },
    currentStreak: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now },

}, {collection: 'UserData'})

export default model('UserData', userDataSchema)
