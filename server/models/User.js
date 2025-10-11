import mongoose from 'mongoose';
// Schema for favorite stops
const FavoriteStopSchema = new mongoose.Schema({
  stopId: String,
  stopName: String,
  route: String
}, { _id: false });
// Schema for user
const UserSchema = new mongoose.Schema({
  githubId: { type: String, index: true, unique: true, sparse: true },
  name: String,
  avatar: String,
  favorites: [FavoriteStopSchema]
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
