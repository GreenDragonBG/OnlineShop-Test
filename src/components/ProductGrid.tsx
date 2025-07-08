import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { products } from '../data/products';

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
  onLoginRequired: () => void;
}

const ProductSection = styled.section`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #EFC0C2 0%, #d4a5a7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SectionSubtitle = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1.5rem;
  border: 2px solid ${props => props.active ? '#EFC0C2' : '#e1e5e9'};
  background: ${props => props.active ? '#EFC0C2' : 'transparent'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    border-color: #EFC0C2;
    background: ${props => props.active ? '#EFC0C2' : 'rgba(239, 192, 194, 0.1)'};
  }
`;

const ProductGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ProductGrid: React.FC<ProductGridProps> = ({ onAddToCart, onLoginRequired }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = products.filter(product => 
    selectedCategory === 'all' || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <ProductSection id="products">
      <SectionTitle>Our Products</SectionTitle>
      <SectionSubtitle>
        Explore our collection with immersive 3D models. Click on any product to view it in 3D.
      </SectionSubtitle>

      <FilterContainer>
        <FilterButton
          active={selectedCategory === 'all'}
          onClick={() => setSelectedCategory('all')}
        >
          All Products
        </FilterButton>
        {categories.slice(1).map(category => (
          <FilterButton
            key={category}
            active={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </FilterButton>
        ))}
      </FilterContainer>

      <FilterContainer>
        <FilterButton
          active={sortBy === 'featured'}
          onClick={() => setSortBy('featured')}
        >
          Featured
        </FilterButton>
        <FilterButton
          active={sortBy === 'price-low'}
          onClick={() => setSortBy('price-low')}
        >
          Price: Low to High
        </FilterButton>
        <FilterButton
          active={sortBy === 'price-high'}
          onClick={() => setSortBy('price-high')}
        >
          Price: High to Low
        </FilterButton>
        <FilterButton
          active={sortBy === 'name'}
          onClick={() => setSortBy('name')}
        >
          Name A-Z
        </FilterButton>
      </FilterContainer>

      <ProductGridContainer>
        {sortedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
              onLoginRequired={onLoginRequired}
            />
          </motion.div>
        ))}
      </ProductGridContainer>
    </ProductSection>
  );
};

export default ProductGrid; 