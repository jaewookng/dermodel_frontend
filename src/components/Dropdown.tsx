import React, { useState, useEffect } from 'react';
import { fetchIngredients } from '../services/ingredientService';

interface Ingredient {
  name: string;
}

const Dropdown: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchIngredients().then(setIngredients);
  }, []);

  return (
    <div className="dropdown">
      <button className="dropbtn">Select Active Ingredient</button>
      <div className="dropdown-content">
        <input
          type="text"
          placeholder="Search ingredients..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          {ingredients
            .filter((ing) => ing.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((ing, index) => (
              <div key={index}>{ing.name}</div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;