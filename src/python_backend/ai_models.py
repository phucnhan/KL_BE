import numpy as np
from sklearn.linear_model import LinearRegression
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

def calculate_bmr(user):
    if user['gender'] == 'male':
        return 88.362 + (13.397 * user['weight']) + (4.799 * user['height']) - (5.677 * user['age'])
    else:
        return 447.593 + (9.247 * user['weight']) + (3.098 * user['height']) - (4.330 * user['age'])

def calculate_tdee(user, bmr):
    activity_factor = {
        'Sedentary': 1.2,
        'Light': 1.375,
        'Moderate': 1.55,
        'High': 1.725,
        'Athlete': 1.9
    }
    return bmr * activity_factor[user['activityLevel']]

def create_nutrition_plan(user, tdee):
    if user['goal'] == 'lose weight':
        goal_calories = tdee - 500
    elif user['goal'] == 'gain muscle':
        goal_calories = tdee + 500
    else:
        goal_calories = tdee

    protein = user['weight'] * 2.2  # 2.2g protein per kg body weight
    fat = goal_calories * 0.25 / 9  # 25% calories from fat
    carbs = (goal_calories - (protein * 4) - (fat * 9)) / 4  # Remaining calories from carbs

    return {
        'calories': goal_calories,
        'protein': protein,
        'fat': fat,
        'carbs': carbs
    }

def train_linear_regression_model(user_data):
    inputs = np.array([[user['age'], user['height'], user['weight'], user['activityLevel']] for user in user_data])
    outputs = np.array([user['calories'] for user in user_data])

    regression = LinearRegression().fit(inputs, outputs)
    return regression

def train_lstm_model(user_data):
    inputs = np.array([[user['age'], user['height'], user['weight'], user['activityLevel']] for user in user_data])
    outputs = np.array([user['calories'] for user in user_data])

    input_tensor = tf.convert_to_tensor(inputs, dtype=tf.float32)
    output_tensor = tf.convert_to_tensor(outputs, dtype=tf.float32)

    model = Sequential()
    model.add(LSTM(50, return_sequences=True, input_shape=(inputs.shape[1], 1)))
    model.add(LSTM(50))
    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mean_squared_error')

    model.fit(input_tensor, output_tensor, epochs=100)
    return model
