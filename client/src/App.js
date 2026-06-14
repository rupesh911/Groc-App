import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import ItemAdder from './components/itemAdder';
import Month from './components/ShowMonth';
import Navbar from './components/Navbar';
import GroceryCategories from './components/GroceryCategories';
import CategoryPage from './components/CategoryPage';
import Checkout from './components/Checkout';
import CheckoutSuccess from './components/CheckoutSuccess';
import AdminPage from './components/AdminPage';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { getUserEmail, getUserName, isAuthenticated, isAdmin } from './services/authService';

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [isAdminUser, setIsAdminUser] = useState(isAdmin());
  const [userEmail, setUserEmail] = useState(getUserEmail() || '');
  const [userName, setUserName] = useState(getUserName() || '');

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setIsAdminUser(isAdmin());
    setUserEmail(getUserEmail() || '');
    setUserName(getUserName() || '');
  }, [authenticated]);

  const handleLogin = (_, email, name) => {
    setAuthenticated(true);
    setUserEmail(email);
    setUserName(name || '');
  };

  const handleLogout = () => {
    localStorage.removeItem('grocify_token');
    localStorage.removeItem('grocify_email');
    localStorage.removeItem('grocify_name');
    setAuthenticated(false);
    setUserEmail('');
    setUserName('');
  };

  const MainPage = () => (
    <>
      <Month />
      {showCheckout ? (
        <Checkout onBack={() => setShowCheckout(false)} />
      ) : selectedCategory ? (
        <CategoryPage category={selectedCategory} onBack={() => setSelectedCategory(null)} />
      ) : (
        <>
          <GroceryCategories onSelectCategory={setSelectedCategory} />
          <header className="App-header">
            <ItemAdder onShowCheckout={() => setShowCheckout(true)} />
          </header>
        </>
      )}
    </>
  );

  return (
    <Router>
      <div className="App">
        <Navbar isAuthenticated={authenticated} isAdmin={isAdminUser} onLogout={handleLogout} currentUser={userName || userEmail} />
        <Switch>
          <Route path="/login">
            {authenticated ? <Redirect to="/" /> : <Login onLogin={handleLogin} />}
          </Route>
          <Route path="/register">
            {authenticated ? <Redirect to="/" /> : <Register />}
          </Route>
          <ProtectedRoute path="/checkout-success" component={CheckoutSuccess} />
          <ProtectedRoute exact path="/" component={MainPage} />
          <ProtectedRoute path="/profile" component={() => <Profile onLogout={handleLogout} />} />
          <AdminRoute path="/admin" component={AdminPage} />
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
