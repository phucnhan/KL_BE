import express from 'express';
import cors from 'cors';
import db from './firebaseAdmin.mjs'; // Đảm bảo đường dẫn đúng
import { calculateBMR, calculateTDEE, createNutritionPlan } from './aiModel.mjs';

const app = express();
const port = process.env.PORT || 5000;

// Middleware để xử lý CORS
app.use(cors());

// Middleware để xử lý JSON body
app.use(express.json());

// Middleware để log các yêu cầu
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.post('/api/user-data', async (req, res) => {
  try {
    const userData = req.body;
    console.log('Received user data:', userData); // Kiểm tra dữ liệu nhận được
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

    const userData = userDoc.data();
    const bmr = calculateBMR(userData);
    const tdee = calculateTDEE(userData, bmr);
    const nutritionPlan = createNutritionPlan(userData, tdee);

    res.json({
      user: userData.name, // Giả sử bạn có trường 'name' trong dữ liệu người dùng
      plan: nutritionPlan
    });
  } catch (error) {
    console.error('Error fetching nutrition plan:', error);
    res.status(500).send('Error fetching nutrition plan');
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
