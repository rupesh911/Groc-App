import './App.css';
import React from 'react';
import ItemAdder from './components/itemAdder';
import Month from "./components/ShowMonth";
import Navbar from './components/Navbar';

function App() {
  
  return (
    <div className="App">
      <Navbar/>
      <Month/>

      <header className="App-header">
        
      
        <ItemAdder/>
       
      </header>
    </div>
  );
}

export default App;
