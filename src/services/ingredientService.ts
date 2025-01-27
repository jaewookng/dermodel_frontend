import axios from 'axios';

interface Ingredient {
  name: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchIngredients = async (): Promise<Ingredient[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ingredients`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return [];
  }
};