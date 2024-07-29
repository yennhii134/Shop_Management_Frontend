import React, { useState } from 'react';
import { Router, Route, Routes } from 'react-router-dom';
import Header from './layouts/Header';
import HomePage from './pages/HomePage';
import Login from './components/Login';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Carts from './pages/Carts';
import Footer from './layouts/Footer';

const App = () => {
  return (
    <>
      <Header />
      <main className="routes-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/carts" element={<Carts />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
