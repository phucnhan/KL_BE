from flask import Flask, request, jsonify

app = Flask(__name__)

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

    protein = user['weight'] * 2.2
    fat = goal_calories * 0.25 / 9
    carbs = (goal_calories - (protein * 4) - (fat * 9)) / 4

    return {
        'calories': goal_calories,
        'protein': protein,
        'fat': fat,
        'carbs': carbs
    }

@app.route('/calculate', methods=['POST'])
def calculate():
    user = request.json
    bmr = calculate_bmr(user)
    tdee = calculate_tdee(user, bmr)
    plan = create_nutrition_plan(user, tdee)
    return jsonify(plan)

if __name__ == '__main__':
    app.run(debug=True)
