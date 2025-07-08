import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface CartProps {
  isOpen: boolean;
  items: Product[];
  onClose: () => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

const CartOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
`;

const CartPanel = styled(motion.div)`
  width: 100%;
  max-width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -5px 0 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const CartHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e1e5e9;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CartTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const CartItems = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const CartItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e1e5e9;
  border-radius: 10px;
  margin-bottom: 1rem;
  background: #fafafa;
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const ItemPrice = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  color: #EFC0C2;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  color: #ff4757;

  &:hover {
    background-color: rgba(255, 71, 87, 0.1);
  }
`;

const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  text-align: center;
  padding: 2rem;
`;

const EmptyCartIcon = styled(ShoppingBag)`
  font-size: 4rem;
  color: #e1e5e9;
  margin-bottom: 1rem;
`;

const CartFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e1e5e9;
  background: #fafafa;
`;

const CartTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
`;

const CheckoutButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #EFC0C2 0%, #d4a5a7 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(239, 192, 194, 0.3);
  }

  &:disabled {
    background: #e1e5e9;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ClearCartButton = styled.button`
  width: 100%;
  background: none;
  color: #EFC0C2;
  border: 2px solid #EFC0C2;
  padding: 0.75rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;

  &:hover {
    background: #EFC0C2;
    color: white;
  }
`;

const Cart: React.FC<CartProps> = ({ isOpen, items, onClose, onRemoveItem, onClearCart }) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <CartOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <CartPanel
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CartHeader>
              <CartTitle>
                <ShoppingBag size={24} />
                Shopping Cart
              </CartTitle>
              <CloseButton onClick={onClose}>
                <X size={24} />
              </CloseButton>
            </CartHeader>

            <CartItems>
              {items.length === 0 ? (
                <EmptyCart>
                  <EmptyCartIcon />
                  <h3>Your cart is empty</h3>
                  <p>Add some products to get started!</p>
                </EmptyCart>
              ) : (
                items.map((item) => (
                  <CartItem key={item.id}>
                    <ItemImage src={item.image} alt={item.name} />
                    <ItemDetails>
                      <ItemName>{item.name}</ItemName>
                      <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
                    </ItemDetails>
                    <RemoveButton onClick={() => onRemoveItem(item.id)}>
                      <Trash2 size={20} />
                    </RemoveButton>
                  </CartItem>
                ))
              )}
            </CartItems>

            {items.length > 0 && (
              <CartFooter>
                <CartTotal>
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </CartTotal>
                <CheckoutButton>
                  Proceed to Checkout
                </CheckoutButton>
                <ClearCartButton onClick={onClearCart}>
                  Clear Cart
                </ClearCartButton>
              </CartFooter>
            )}
          </CartPanel>
        </CartOverlay>
      )}
    </AnimatePresence>
  );
};

export default Cart; 