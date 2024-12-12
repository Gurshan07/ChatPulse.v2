import express from 'express';
import { Counter } from '../models/counter.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let counter = await Counter.findOne();
    if (!counter) {
      counter = await Counter.create({ value: 0 });
    }
    res.json({ value: counter.value });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  const { value } = req.body;
  try {
    let counter = await Counter.findOne();
    if (!counter) {
      counter = await Counter.create({ value });
    } else {
      counter.value = value;
      await counter.save();
    }
    res.json({ value: counter.value });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
