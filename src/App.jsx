import React, { useState } from 'react';
import { Router, Route, Routes } from 'react-router-dom';
import Header from './layouts/Header';
import HomePage from './components/HomeComponent';
import Login from './components/LoginComponent';
import Products from './components/ProductComponent';
import ProductDetail from './components/ProductDetailComponent';
import Carts from './components/CartComponent';
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
