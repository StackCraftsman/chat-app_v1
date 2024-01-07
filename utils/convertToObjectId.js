// utils.js
import mongoose from 'mongoose';

export function convertToObjectId(offset) {
  try {
    return mongoose.Types.ObjectId(offset);
  } catch (error) {
    return new mongoose.Types.ObjectId('000000000000000000000000');
  }
}
