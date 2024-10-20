export function calculateBMR(user) {
  if (user.gender === 'male') {
    return 88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * user.age);
  } else {
    return 447.593 + (9.247 * user.weight) + (3.098 * user.height) - (4.330 * user.age);
  }
}

export function calculateTDEE(user, bmr) {
  let activityFactor = {
    'Sedentary': 1.2,
    'Light': 1.375,
    'Moderate': 1.55,
    'High': 1.725,
    'Athlete': 1.9
  };
  return bmr * activityFactor[user.activityLevel];
}

export function createNutritionPlan(user, tdee) {
  let goalCalories;
  if (user.goal === 'lose weight') {
    goalCalories = tdee - 500;
  } else if (user.goal === 'gain muscle') {
    goalCalories = tdee + 500;
  } else {
    goalCalories = tdee;
  }

  let protein = user.weight * 2.2; // 2.2g protein per kg body weight
  let fat = goalCalories * 0.25 / 9; // 25% calories from fat
  let carbs = (goalCalories - (protein * 4) - (fat * 9)) / 4; // Remaining calories from carbs

  return {
    calories: goalCalories,
    protein: protein,
    fat: fat,
    carbs: carbs
  };
}
