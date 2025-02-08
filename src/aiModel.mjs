import axios from 'axios';

export async function calculateBMR(user) {
    try {
        const response = await axios.post('http://10.210.243.255:10000/calculate', user);
        return response.data;
    } catch (error) {
        console.error('Error calculating BMR:', error);
        throw error;
    }
}
