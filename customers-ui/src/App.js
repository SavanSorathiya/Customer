import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CustomerPage from './CustomerPage';
import ProductPage from './ProductPage';
import ProductCategoryPage from './ProductCategoryPage';

function App() {
  return (
    <BrowserRouter>
      <div className="container mt-3">
        <nav>
          <Link to="/">Customers</Link> | <Link to="/products">Products</Link> | <Link to="/productCategory">Category</Link>
        </nav>
        <Routes>
          <Route path="/" element={<CustomerPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/productCategory" element={<ProductCategoryPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
