import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
    default: 0
  }
});

export const Counter = mongoose.model('Counter', counterSchema);
