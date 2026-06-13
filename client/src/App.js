import './App.css';
import React, { useState } from 'react';
import ItemAdder from './components/itemAdder';
import Month from "./components/ShowMonth";
import Navbar from './components/Navbar';
import GroceryCategories from './components/GroceryCategories';
import CategoryPage from './components/CategoryPage';

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="App">
      <Navbar />
      <Month />
      {selectedCategory ? (
        <CategoryPage
          category={selectedCategory}
          onBack={() => setSelectedCategory(null)}
        />
      ) : (
        <>
          <GroceryCategories onSelectCategory={setSelectedCategory} />
          <header className="App-header">
            <ItemAdder />
          </header>
        </>
      )}
    </div>
  );
}

export default App;
