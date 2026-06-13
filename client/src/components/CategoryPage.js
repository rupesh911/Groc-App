import React, { useState } from "react";
import Axios from "axios";
import "./Style.css";

const productsByCategory = {
  Vegetables: [
    { name: "Tomatoes", price: 1 },
    { name: "Onions", price: 30 },
    { name: "Potatoes", price: 25 },
    { name: "Spinach", price: 18 },
  ],
  Fruits: [
    { name: "Bananas", price: 45 },
    { name: "Apples", price: 120 },
    { name: "Oranges", price: 70 },
    { name: "Grapes", price: 95 },
  ],
  Dairy: [
    { name: "Milk", price: 60 },
    { name: "Paneer", price: 180 },
    { name: "Yogurt", price: 55 },
    { name: "Butter", price: 150 },
  ],
  Bakery: [
    { name: "Bread", price: 40 },
    { name: "Croissant", price: 80 },
    { name: "Cookies", price: 95 },
    { name: "Cake Slice", price: 120 },
  ],
  Snacks: [
    { name: "Cookies", price: 64 },
    { name: "Chips", price: 55 },
    { name: "Nuts Mix", price: 180 },
    { name: "Granola Bars", price: 90 },
  ],
  Beverages: [
    { name: "Juice", price: 110 },
    { name: "Tea Pack", price: 85 },
    { name: "Coffee", price: 220 },
    { name: "Soda", price: 50 },
  ],
  Household: [
    { name: "Dish Soap", price: 95 },
    { name: "Laundry Detergent", price: 220 },
    { name: "Floor Cleaner", price: 130 },
    { name: "Paper Towels", price: 70 },
  ],
  Frozen: [
    { name: "Frozen Peas", price: 120 },
    { name: "Ice Cream", price: 150 },
    { name: "Frozen Pizza", price: 180 },
    { name: "Veg Nuggets", price: 140 },
  ],
  "Personal Care": [
    { name: "Shampoo", price: 180 },
    { name: "Soap", price: 45 },
    { name: "Toothpaste", price: 130 },
    { name: "Face Wash", price: 120 },
  ],
};

const CategoryPage = ({ category, onBack }) => {
  const [feedback, setFeedback] = useState("");

  const addProduct = (product) => {
    const data = { grocceryItem: `${product.name} (${category})`, price: product.price };
    Axios.post('http://localhost:9000/groccery/add', data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('grocify_token')}` },
    })
      .then(() => {
        setFeedback(`${product.name} added to your Grocify list.`);
        setTimeout(() => setFeedback(''), 2800);
      })
      .catch((error) => {
        setFeedback(error.response?.data || 'Unable to add item');
        setTimeout(() => setFeedback(''), 2800);
      });
  };

  const products = productsByCategory[category] || [];

  return (
    <div className="category-page">
      <div className="category-top-bar">
        <button className="category-back-button" onClick={onBack}>
          ← Back to Grocify
        </button>
        <h2>{category} Products</h2>
      </div>
      <p className="category-description">
        Select items from the {category} section to add to your monthly grocery plan. When you return to the main page, the list and total price will update.
      </p>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.name} className="product-card">
            <div>
              <strong>{product.name}</strong>
              <div className="product-price">₹{product.price.toFixed(0)}</div>
            </div>
            <button className="product-add-button" onClick={() => addProduct(product)}>
              Add
            </button>
          </div>
        ))}
      </div>
      {feedback && <div className="category-feedback">{feedback}</div>}
    </div>
  );
};

export default CategoryPage;
