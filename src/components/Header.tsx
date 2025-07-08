import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ShoppingCart, Menu, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../backend/supabaseClient';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onLoginClick: () => void;
}

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
`;

const Logo = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #EFC0C2 0%, #d4a5a7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #EFC0C2;
  }
`;

const CartButton = styled.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(239, 192, 194, 0.1);
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
      background: #EFC0C2;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

const UserButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: rgba(239, 192, 194, 0.1);
  }
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #333;
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, #EFC0C2 0%, #d4a5a7 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(239, 192, 194, 0.3);
  }
`;

const UserDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  overflow: hidden;
  z-index: 1000;
  margin-top: 0.5rem;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(239, 192, 194, 0.1);
  }

  &:first-child {
    border-bottom: 1px solid #e1e5e9;
  }
`;

const UserContainer = styled.div`
  position: relative;
`;

const Header: React.FC<HeaderProps> = ({ cartItemCount, onCartClick, onLoginClick }) => {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch latest user info from DB on mount or when user/email changes
  useEffect(() => {
    const fetchUserFromDB = async () => {
      if (!user?.email) return;
      const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('email', user.email)
        .single();
      if (error || !data) return;
      updateUser({ ...user, ...data });
    };
    fetchUserFromDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUserClick = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
  };

  return (
    <HeaderContainer>
      <Logo>3D Shop</Logo>
      
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="#products">Products</NavLink>
        <NavLink href="#about">About</NavLink>
        <NavLink href="#contact">Contact</NavLink>
      </Nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <CartButton onClick={onCartClick}>
          <ShoppingCart size={24} />
          {cartItemCount > 0 && <CartBadge>{cartItemCount}</CartBadge>}
        </CartButton>
        
        {isAuthenticated ? (
          <UserContainer ref={userDropdownRef}>
            <UserButton onClick={handleUserClick}>
              {user?.profilePic ? (
                <UserAvatar src={user.profilePic} alt={user.name || user.email} />
              ) : user?.avatar ? (
                <UserAvatar src={user.avatar} alt={user.name || user.email} />
              ) : (
                <User size={24} />
              )}
              <UserName>{user?.name}</UserName>
            </UserButton>
            
            {showUserDropdown && (
              <UserDropdown ref={userDropdownRef}>
                <DropdownItem onClick={() => { setShowUserDropdown(false); navigate('/settings'); }}>
                  <Settings size={18} /> Settings
                </DropdownItem>
                <DropdownItem onClick={logout}>
                  <LogOut size={18} /> Logout
                </DropdownItem>
              </UserDropdown>
            )}
          </UserContainer>
        ) : (
          <LoginButton onClick={onLoginClick}>
            <User size={16} />
            Login
          </LoginButton>
        )}
        
        <MobileMenuButton>
          <Menu size={24} />
        </MobileMenuButton>
      </div>
    </HeaderContainer>
  );
};

export default Header; 