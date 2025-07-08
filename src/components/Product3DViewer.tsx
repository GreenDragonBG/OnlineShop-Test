import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { FBXLoader } from 'three-stdlib';
import * as THREE from 'three';
import { Product } from '../types';

interface Product3DViewerProps {
  product: Product;
}

const ViewerContainer = styled.div`
  width: 100%;
  height: 600px;
  position: relative ;
  background: linear-gradient(135deg, #fefefe 0%, #fef8f5 100%);
`;

const Controls = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 10;
`;

const ControlButton = styled.button`
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

const ProductInfo = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  max-width: 300px;
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

const ProductDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
`;

const CupModel: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);

  useEffect(() => {
    const loader = new FBXLoader();
    loader.load('/models/Cup1 model.fbx', (object) => {
      object.scale.set(0.01, 0.01, 0.01);
      object.position.set(0, 2, 0);
      
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.material) {
            child.material.needsUpdate = true;
            if (child.material.color) {
              child.material.color.multiplyScalar(1.2);
            }
          }
        }
      });
      
      setModel(object);
    });
  }, []);

  if (!model) {
    return (
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1.5, 8]} />
        <meshStandardMaterial color="#EFC0C2" metalness={0.3} roughness={0.5} />
      </mesh>
    );
  }

  return (
    <primitive 
      ref={meshRef} 
      object={model} 
      position={[0, -1.5, 0]} 
      scale={[0.01, 0.01, 0.01]}
    />
  );
};

const TShirtModel: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);

  useEffect(() => {
    const loader = new FBXLoader();
    loader.load('/models/maniken/Basic Tee1 Manequeen_Model.fbx', (object) => {
      object.scale.set(0.01, 0.01, 0.01);
      object.position.set(0, 2, 0);
      
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.material) {
            child.material.needsUpdate = true;
            if (child.material.color) {
              child.material.color.multiplyScalar(1.2);
            }
          }
        }
      });
      
      setModel(object);
    });
  }, []);

  if (!model) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1.5, 0.1]} />
        <meshStandardMaterial color="#4a90e2" metalness={0.1} roughness={0.8} />
      </mesh>
    );
  }

  return (
    <primitive 
      ref={meshRef} 
      object={model} 
      position={[0, -1.5, 0]} 
      scale={[0.01, 0.01, 0.01]}
    />
  );
};

const TShirt2Model: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);

  useEffect(() => {
    const loader = new FBXLoader();
    loader.load('public/models/maniken/Basic Tee3 Manequeen_Model.fbx', (object) => {
      object.scale.set(0.01, 0.01, 0.01);
      object.position.set(0, 2, 0);
      
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.material) {
            child.material.needsUpdate = true;
            if (child.material.color) {
              child.material.color.multiplyScalar(1.2);
            }
          }
        }
      });
      
      setModel(object);
    });
  }, []);

  if (!model) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1.5, 0.1]} />
        <meshStandardMaterial color="#e74c3c" metalness={0.1} roughness={0.8} />
      </mesh>
    );
  }

  return (
    <primitive 
      ref={meshRef} 
      object={model} 
      position={[0, -1.5, 0]} 
      scale={[0.01, 0.01, 0.01]}
    />
  );
};

const TShirt3Model: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);

  useEffect(() => {
    const loader = new FBXLoader();
    loader.load('/models/catalog/Basic Tee3 Catalog_Model.fbx', (object) => {
      object.scale.set(0.01, 0.01, 0.01);
      object.position.set(0, 2, 0);
      
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.material) {
            child.material.needsUpdate = true;
            if (child.material.color) {
              child.material.color.multiplyScalar(1.2);
            }
          }
        }
      });
      
      setModel(object);
    });
  }, []);

  if (!model) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1.5, 0.1]} />
        <meshStandardMaterial color="#27ae60" metalness={0.1} roughness={0.8} />
      </mesh>
    );
  }

  return (
    <primitive 
      ref={meshRef} 
      object={model} 
      position={[0, -1.5, 0]} 
      scale={[0.01, 0.01, 0.01]}
    />
  );
};

const ProductModel: React.FC<{ product: Product }> = ({ product }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const getModelGeometry = () => {
    switch (product.category) {
      case 'electronics':
        return <boxGeometry args={[2, 1, 1]} />;
      case 'furniture':
        return <cylinderGeometry args={[1, 1, 2, 8]} />;
      default:
        return <sphereGeometry args={[1, 32, 32]} />;
    }
  };

  const getModelMaterial = () => {
    switch (product.category) {
      case 'electronics':
        return <meshStandardMaterial color="#2c3e50" metalness={0.8} roughness={0.2} />;
      case 'furniture':
        return <meshStandardMaterial color="#8b4513" metalness={0.1} roughness={0.8} />;
      default:
        return <meshStandardMaterial color="#EFC0C2" metalness={0.3} roughness={0.5} />;
    }
  };

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      {getModelGeometry()}
      {getModelMaterial()}
    </mesh>
  );
};

const Product3DViewer: React.FC<Product3DViewerProps> = ({ product }) => {
  const [autoRotate, setAutoRotate] = useState(false);

  const handleResetView = () => {
    const controls = document.querySelector('canvas')?.parentElement?.querySelector('div');
    if (controls) {
    }
  };

  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
  };

  const isFirstProduct = product.id === '1';
  const isSecondProduct = product.id === '2';
  const isThirdProduct = product.id === '3';
  const isFourthProduct = product.id === '4';

  return (
    <ViewerContainer>
      <ProductInfo>
        <ProductName>{product.name}</ProductName>
        <ProductDescription>{product.description}</ProductDescription>
      </ProductInfo>

      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight 
          position={[-5, 5, -5]} 
          intensity={0.8} 
          color="#ffffff"
        />
        <pointLight 
          position={[0, 10, 0]} 
          intensity={0.5} 
          color="#ffffff"
        />
        <pointLight 
          position={[0, -10, 0]} 
          intensity={0.3} 
          color="#ffffff"
        />
        
        {isFirstProduct ? (
          <CupModel />
        ) : isSecondProduct ? (
          <TShirtModel />
        ) : isThirdProduct ? (
          <TShirt2Model />
        ) : isFourthProduct ? (
          <TShirt3Model />
        ) : (
          <ProductModel product={product} />
        )}
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={autoRotate}
          autoRotateSpeed={2}
        />
        
        {/* Use a brighter environment preset */}
        <Environment preset="sunset" />
      </Canvas>

      <Controls>
        <ControlButton onClick={handleResetView} title="Reset View">
          🔄
        </ControlButton>
        <ControlButton onClick={toggleAutoRotate} title={autoRotate ? "Stop Rotation" : "Start Rotation"}>
          {autoRotate ? "⏸️" : "▶️"}
        </ControlButton>
      </Controls>
    </ViewerContainer>
  );
};

export default Product3DViewer; 