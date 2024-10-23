import { calculateBMR } from './aiModel.mjs';

export async function getNutritionPlan(user) {
    try {
        const plan = await calculateBMR(user);
        return plan;
    } catch (error) {
        console.error('Error getting nutrition plan:', error);
        throw error;
    }
}
