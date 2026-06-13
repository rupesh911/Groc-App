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
      <p>Add items from categories like vegetables, fruits, dairy, bakery, snacks, beverages, household, frozen, and personal care.</p>
      <p className="category-description-small">Click a category to move to a different page and add products.</p>
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
