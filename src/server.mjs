import express from 'express';
import cors from 'cors';
import axios from 'axios';
import db from './firebaseAdmin.mjs';
import { combineData } from './dataService.mjs';

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
    res.status(200).send('User data saved successfully');
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).send('Error saving user data');
  }
});

app.get('/api/nutrition-plan/:uid', async (req, res) => {
  try {
    const uid = req.params.uid;
    const userRef = db.collection('usersdata').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      res.status(404).send('User not found');
      return;
    }

    // Fetch all nutrition plans for the user
    const plansRef = userRef.collection('nutritionPlans');
    const plansSnapshot = await plansRef.get();

    if (plansSnapshot.empty) {
      res.status(404).send('No plans found for this user');
      return;
    }

    const plans = [];
    plansSnapshot.forEach(doc => {
      plans.push(doc.data());
    });

    res.json({ user: userDoc.data().name, plans });
  } catch (error) {
    console.error('Error fetching nutrition plan:', error);
    res.status(500).send('Error fetching nutrition plan');
  }
});


app.post('/api/generate-plan', async (req, res) => {
  try {
    const { user, plan_type } = req.body;
    const planResponse = await axios.post('https://kl-be-python.onrender.com/generate-plan', { user, plan_type });
    res.json(planResponse.data);
  } catch (error) {
    console.error('Error generating plan:', error);
    res.status(500).send('Error generating plan');
  }
});

app.get('/api/train-models', async (req, res) => {
  try {
    const combinedData = await combineData();
    await axios.post('https://kl-be-python.onrender.com/train-linear-regression-model', combinedData);
    await axios.post('https://kl-be-python.onrender.com/train-lstm-model', combinedData);

    res.status(200).send('Models trained successfully');
  } catch (error) {
    console.error('Error training models:', error);
    res.status(500).send('Error training models');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
