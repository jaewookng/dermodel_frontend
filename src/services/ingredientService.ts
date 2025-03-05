import axios from 'axios';

interface Ingredient {
  name: string;
}

interface ApiResponse {
  meta: Record<string, unknown>;
  results: Array<{
    name: string;
    [key: string]: unknown;  // For other properties we don't use
  }>;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dermodel-backend-c1b9c7f69d88.herokuapp.com/api';

export const fetchIngredients = async (): Promise<Ingredient[]> => {
  try {
    const response = await axios.get<ApiResponse>(`${API_BASE_URL}/ingredients`);
    const { results } = response.data;

    if (!Array.isArray(results)) {
      console.error('Invalid results format:', results);
      return [];
    }

    return results.map(item => ({
      name: item.name || ''
    }));
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return [];
  }
};