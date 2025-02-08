import axios from 'axios';

export async function calculateBMR(user) {
    try {
        const response = await axios.post('https://kl-be-python.onrender.com/calculate', user);
        return response.data;
    } catch (error) {
        console.error('Error calculating BMR:', error);
        throw error;
    }
}
