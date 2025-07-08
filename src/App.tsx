import React, { useState } from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import LoginModal from './components/LoginModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Product } from './types';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SettingsPage from './components/SettingsPage';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fefefe 0%, #fef8f5 100%);
`;

const MainContent = styled.main`
  padding-top: 80px;
`;

const AppContent: React.FC = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCartItems(prev => [...prev, product]);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleLoginRequired = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <BrowserRouter>
      <AppContainer>
        <Header 
          cartItemCount={cartItems.length}
          onCartClick={() => setIsCartOpen(true)}
          onLoginClick={() => setIsLoginModalOpen(true)}
        />
        <Routes>
          <Route path="/" element={
            <MainContent>
              <Hero />
              <ProductGrid 
                onAddToCart={addToCart} 
                onLoginRequired={handleLoginRequired}
              />
            </MainContent>
          } />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        <Cart 
          isOpen={isCartOpen}
          items={cartItems}
          onClose={() => setIsCartOpen(false)}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
        />
        <LoginModal 
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSuccess={handleLoginSuccess}
        />
      </AppContainer>
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App; 