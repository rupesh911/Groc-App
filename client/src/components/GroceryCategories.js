import React from "react";
import "./Style.css";

const categories = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Bakery",
  "Snacks",
  "Beverages",
  "Household",
  "Frozen",
  "Personal Care",
];

const GroceryCategories = ({ onSelectCategory }) => {
  return (
    <div className="category-section">
      <h3>Available grocery categories in Grocify</h3>
      <p>Add items from categories like vegetables, fruits, dairy, snacks, beverages, household and more. Click a category to open its product page.</p>
      <div className="category-list">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className="category-pill"
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GroceryCategories;
