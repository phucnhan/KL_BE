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

app.get('/api/user-data/:uid', async (req, res) => {
  const uid = req.params.uid;
  try {
    const userRef = db.collection('usersdata').doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(userDoc.data());
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Error fetching user data');
  }
});


app.get('/api/nutrition-plan/:uid', async (req, res) => {
  try {
    const uid = req.params.uid;
    const userRef = db.collection('usersdata').doc(uid);
    const plansRef = userRef.collection('nutritionPlans');
    const plansSnapshot = await plansRef.get();

    if (plansSnapshot.empty) {
      res.status(404).send('No nutrition plans found for this user');
      return;
    }

    const plans = [];
    plansSnapshot.forEach((doc) => {
      plans.push(doc.data());
    });

    res.status(200).json({ plans });
  } catch (error) {
    console.error('Error fetching nutrition plan:', error);
    res.status(500).send('Error fetching nutrition plan');
  }
});


app.post('/api/generate-plan', async (req, res) => {
  try {
    const { user } = req.body;
    const { uid, selectedOption } = user;

    if (!uid || !selectedOption) {
      throw new Error('Missing required fields: uid or selectedOption');
    }

    console.log('Generating plan for user:', uid, 'with option:', selectedOption);

    // Logic xử lý plan ở đây (ví dụ gọi Flask API)
    const planResponse = await axios.post('http://127.0.0.1:5000/generate-plan', {
      uid,
      selectedOption,
    });

    res.json(planResponse.data);
  } catch (error) {
    console.error('Error generating plan:', error.message);
    res.status(500).send('Error generating plan');
  }
});



app.get('/api/train-models', async (req, res) => {
  try {
    const combinedData = await combineData();
    await axios.post('http://localhost:5001/train-linear-regression-model', combinedData);
    await axios.post('http://localhost:5001/train-lstm-model', combinedData);

    res.status(200).send('Models trained successfully');
  } catch (error) {
    console.error('Error training models:', error);
    res.status(500).send('Error training models');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
