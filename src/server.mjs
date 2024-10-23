import express from 'express';
import cors from 'cors';
import db from './firebaseAdmin.mjs';
import { getNutritionPlan } from './dataService.mjs';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.post('/api/user-data', async (req, res) => {
  try {
    const userData = req.body;
    console.log('Received user data:', userData);
    const userRef = db.collection('usersdata').doc(userData.uid);
    await userRef.set(userData);
    res.status(200).json({ message: 'User data saved successfully' });
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).json({ error: 'Error saving user data', details: error.message });
  }
});

app.get('/api/nutrition-plan/:uid', async (req, res) => {
  try {
    const uid = req.params.uid;
    const userRef = db.collection('usersdata').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const userData = userDoc.data();
    const plan = await getNutritionPlan(userData);

    res.json({
      user: userData.name,
      plan: plan
    });
  } catch (error) {
    console.error('Error fetching nutrition plan:', error);
    res.status(500).json({ error: 'Error fetching nutrition plan', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
