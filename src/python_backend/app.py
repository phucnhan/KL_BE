from flask import Flask, request, jsonify
from ai_models import fetch_user_data, calculate_bmr, calculate_tdee, create_nutrition_plan, generate_plan, train_linear_regression_model, train_lstm_model

app = Flask(__name__)

@app.route('/calculate-bmr', methods=['POST'])
def calculate_bmr_route():
    user = request.json
    bmr = calculate_bmr(user)
    return jsonify(bmr=bmr)

@app.route('/calculate-tdee', methods=['POST'])
def calculate_tdee_route():
    data = request.json
    user = data['user']
    bmr = data['bmr']
    tdee = calculate_tdee(user, bmr)
    return jsonify(tdee=tdee)

@app.route('/create-nutrition-plan', methods=['POST'])
def create_nutrition_plan_route():
    data = request.json
    user = data['user']
    tdee = data['tdee']
    plan = create_nutrition_plan(user, tdee)
    return jsonify(plan=plan)

@app.route('/generate-plan', methods=['POST'])
def generate_plan_route():
    try:
        data = request.json
        uid = data['uid']
        user = fetch_user_data(uid)
        plan = generate_plan(user)
        return jsonify(plan=plan)
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/train-linear-regression-model', methods=['POST'])
def train_linear_regression_model_route():
    user_data = request.json
    model = train_linear_regression_model(user_data)
    return jsonify(message="Linear Regression Model trained successfully")

@app.route('/train-lstm-model', methods=['POST'])
def train_lstm_model_route():
    user_data = request.json
    model = train_lstm_model(user_data)
    return jsonify(message="LSTM Model trained successfully")

@app.route('/test-fetch-user/<uid>', methods=['GET'])
def test_fetch_user(uid):
    try:
        user = fetch_user_data(uid)
        return jsonify(user=user)
    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
