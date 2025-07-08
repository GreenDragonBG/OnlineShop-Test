import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Star, X } from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Product3DViewer from './Product3DViewer';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onLoginRequired: () => void;
}

const Card = styled(motion.div)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 250px;
  overflow: hidden;
  background: linear-gradient(135deg, #fefefe 0%, #fef8f5 100%);
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const View3DButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: white;
    transform: scale(1.1);
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

const ProductDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #EFC0C2;
  margin-bottom: 1rem;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
`;

const StarIcon = styled(Star)<{ filled: boolean }>`
  color: ${props => props.filled ? '#ffd700' : '#e1e5e9'};
  fill: ${props => props.filled ? '#ffd700' : 'none'};
`;

const RatingText = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const AddToCartButton = styled.button`
  flex: 1;
  background: linear-gradient(135deg, #EFC0C2 0%, #d4a5a7 100%);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(239, 192, 194, 0.3);
  }
`;

const View3DButtonLarge = styled.button`
  background: rgba(239, 192, 194, 0.1);
  color: #EFC0C2;
  border: 2px solid #EFC0C2;
  padding: 0.75rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #EFC0C2;
    color: white;
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  backdrop-filter: blur(10px);

  &:hover {
    background: white;
  }
`;

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onLoginRequired }) => {
  const [show3D, setShow3D] = useState(false);
  const [rating] = useState(Math.floor(Math.random() * 2) + 4);
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAuthenticated) {
      onAddToCart(product);
    } else {
      onLoginRequired();
    }
  };

  const handleView3D = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShow3D(true);
  };

  return (
    <>
      <Card
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <ImageContainer>
          <ProductImage src={product.image} alt={product.name} />
          <View3DButton onClick={handleView3D}>
            <Eye size={20} />
          </View3DButton>
        </ImageContainer>

        <CardContent>
          <ProductName>{product.name}</ProductName>
          <ProductDescription>{product.description}</ProductDescription>
          
          <Rating>
            <Stars>
              {[1, 2, 3, 4, 5].map(star => (
                <StarIcon key={star} size={16} filled={star <= rating} />
              ))}
            </Stars>
            <RatingText>({rating}.0)</RatingText>
          </Rating>

          <Price>${product.price.toFixed(2)}</Price>

          <ActionButtons>
            <AddToCartButton onClick={handleAddToCart}>
              <ShoppingCart size={18} />
              Add to Cart
            </AddToCartButton>
            <View3DButtonLarge onClick={handleView3D}>
              <Eye size={18} />
              3D View
            </View3DButtonLarge>
          </ActionButtons>
        </CardContent>
      </Card>

      {show3D && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShow3D(false)}
        >
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setShow3D(false)}>
              <X size={20} />
            </CloseButton>
            <Product3DViewer product={product} />
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ProductCard;
