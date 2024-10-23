import axios from 'axios';

export async function calculateBMR(user) {
    try {
        const response = await axios.post('http://127.0.0.1:5000/calculate', user);
        return response.data;
    } catch (error) {
        console.error('Error calculating BMR:', error);
        throw error;
    }
}
