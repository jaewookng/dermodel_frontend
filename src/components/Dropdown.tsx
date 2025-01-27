import React, { useState, useEffect } from 'react';
import { fetchIngredients } from '../services/ingredientService';

interface Ingredient {
  name: string;
}

const Dropdown: React.FC = () => {
  // Initialize with empty array to ensure type safety
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadIngredients = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchIngredients();
        
        if (isMounted) {
          // Ensure data is array and contains valid ingredients
          const validData = Array.isArray(data) ? data.filter(item => 
            item && typeof item === 'object' && 'name' in item
          ) : [];
          
          setIngredients(validData);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load ingredients:', err);
          setError('Failed to load ingredients');
          setIngredients([]); // Reset to empty array on error
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadIngredients();
    return () => { isMounted = false; };
  }, []);

  // Move filtering logic outside JSX for better readability
  const getFilteredIngredients = () => {
    if (!Array.isArray(ingredients)) return [];
    return ingredients.filter(ing => 
      ing?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="dropdown">
      <button className="dropbtn">Select Active Ingredient</button>
      <div className="dropdown-content">
        <input
          type="text"
          placeholder="Search ingredients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isLoading && <div className="loading-overlay">Loading...</div>}
        {error && <div className="error-overlay">{error}</div>}
        <div>
          {getFilteredIngredients().map((ing, index) => (
            <div key={`${ing.name}-${index}`}>{ing.name}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;