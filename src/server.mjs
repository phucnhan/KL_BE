// src/server.js
import express from 'express';
import { generateNutritionPlans } from './aiModel.mjs';

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/nutrition-plans', async (req, res) => {
  try {
    const plans = await generateNutritionPlans();
    res.json(plans);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
