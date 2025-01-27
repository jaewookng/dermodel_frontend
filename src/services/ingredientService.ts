import axios from 'axios';

interface Ingredient {
  name: string;
}

interface ApiResponse {
  meta: Record<string, any>;
  results: Array<{
    name: string;
    [key: string]: any;  // For other properties we don't use
  }>;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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