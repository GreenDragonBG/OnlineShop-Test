import React, { useState, useEffect } from 'react';
import { supabase } from '../../backend/supabaseClient';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, User, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials, SignupCredentials } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

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
  z-index: 2000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 20px;
  max-width: 400px;
  width: 100%;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
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

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e1e5e9;
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: ${props => props.active ? '#EFC0C2' : '#666'};
  border-bottom: 2px solid ${props => props.active ? '#EFC0C2' : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    color: #EFC0C2;
  }
`;

const FormContainer = styled.div`
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #EFC0C2;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #EFC0C2 0%, #d4a5a7 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(239, 192, 194, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1rem;
`;

const SuccessMessage = styled.div`
  color: #27ae60;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1rem;
`;

const DemoInfo = styled.div`
  background: rgba(239, 192, 194, 0.1);
  border: 1px solid #EFC0C2;
  border-radius: 10px;
  padding: 1rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
`;

// 2FA Modal Component
const TwoFAModal: React.FC<{
  email: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ email, isOpen, onClose, onSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  // Clear code when modal is closed or after success
  useEffect(() => {
    if (!isOpen) setCode('');
  }, [isOpen]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://127.0.0.1:5051/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await res.json();
      if (data.success) {
        setCode(''); // Clear code after success
        onSuccess();
      } else {
        setError(data.message || 'Invalid or expired code');
      }
    } catch (err) {
      setError('Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');
    try {
      await fetch('http://127.0.0.1:5051/send-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      setResent(true);
      setTimeout(() => setResent(false), 2000);
    } catch (err) {
      setError('Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <Modal initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <ModalContent initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
        <CloseButton onClick={onClose}><X size={20} /></CloseButton>
        <h2 style={{ textAlign: 'center', margin: '2rem 0 1rem 0' }}>Enter 2FA Code</h2>
        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
            style={{ fontSize: 20, textAlign: 'center', padding: 12, borderRadius: 8, border: '1px solid #eee' }}
            autoFocus
          />
          <button type="submit" disabled={loading || code.length !== 6} style={{ padding: 12, borderRadius: 8, background: '#EFC0C2', color: '#fff', border: 'none', fontWeight: 600 }}>
            Verify
          </button>
          <button type="button" onClick={handleResend} disabled={loading} style={{ background: 'none', border: 'none', color: '#EFC0C2', textDecoration: 'underline', cursor: 'pointer' }}>
            Resend Code
          </button>
          {resent && <div style={{ color: '#27ae60', textAlign: 'center' }}>Code resent!</div>}
          {error && <div style={{ color: '#e74c3c', textAlign: 'center' }}>{error}</div>}
        </form>
      </ModalContent>
    </Modal>
  );
};

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);
  
  const { login, signup, isLoading, setUser } = useAuth();

  const [loginForm, setLoginForm] = useState<LoginCredentials>({
    email: '',
    password: ''
  });

  const [signupForm, setSignupForm] = useState<SignupCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 1. Check password (use your existing loginUser function)
    const result = await loginUser(email, password);
    if (result.success) {
      // Check if 2FA is enabled for this user
      if (result.user.twoFA === true) {
        try {
          await fetch('http://127.0.0.1:5051/send-2fa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          setPendingUser(result.user); // Save user info for after 2FA
          setShow2FA(true);
        } catch (err) {
          setError('Failed to send 2FA code.');
        }
      } else {
        // No 2FA, log in directly
        setUser({
          id: result.user.id,
          email: result.user.email,
          name: result.user.name || result.user.username || result.user.email,
          avatar: result.user.avatar || undefined,
          profilePic: result.user.profilePic || undefined,
          twoFA: result.user.twoFA
        });
        setSuccess('Login successful!');
        setEmail("");
        setPassword("");
        setTimeout(() => {
          onClose();
          onSuccess?.();
        }, 1000);
      }
    } else {
      setError(result.error || 'Invalid email or password.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signupForm.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const result = await registerUser(signupForm.name, signupForm.email, signupForm.password);
    if (result.success) {
      setUser({
        id: result.user.id,
        email: result.user.email,
        name: result.user.name || result.user.username || result.user.email,
        avatar: result.user.avatar || undefined
      });
      setSuccess('Account created successfully!');
      setSignupForm({ name: '', email: '', password: '', confirmPassword: '' });
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 1000);
    } else {
      let errorMsg = result.error || 'Email already exists';
      if (errorMsg.includes('duplicate key value violates unique constraint "Users_email_key"')) {
        errorMsg = 'Account with this email already exists';
      }
      setError(errorMsg);
    }
  };

  const handleTabChange = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
  };

  const handleLogin = () => {
    loginUser(email, password);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton onClick={onClose}>
                <X size={20} />
              </CloseButton>

              <TabContainer>
                <Tab
                  active={activeTab === 'login'}
                  onClick={() => handleTabChange('login')}
                >
                  <LogIn size={16} style={{ marginRight: '0.5rem' }} />
                  Login
                </Tab>
                <Tab
                  active={activeTab === 'signup'}
                  onClick={() => handleTabChange('signup')}
                >
                  <UserPlus size={16} style={{ marginRight: '0.5rem' }} />
                  Sign Up
                </Tab>
              </TabContainer>

              <FormContainer>
                {activeTab === 'login' ? (
                  <Form onSubmit={handleLoginSubmit}>
                    <InputGroup>
                      <InputIcon>
                        <Mail size={20} />
                      </InputIcon>
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </InputGroup>

                    <InputGroup>
                      <InputIcon>
                        <Lock size={20} />
                      </InputIcon>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <PasswordToggle
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </PasswordToggle>
                    </InputGroup>

                    <SubmitButton type="submit" disabled={isLoading}>
                      {isLoading ? 'Logging in...' : 'Login'}
                    </SubmitButton>
                  </Form>
                ) : (
                  <Form onSubmit={handleSignupSubmit}>
                    <InputGroup>
                      <InputIcon>
                        <User size={20} />
                      </InputIcon>
                      <Input
                        type="text"
                        placeholder="Username"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </InputGroup>

                    <InputGroup>
                      <InputIcon>
                        <Mail size={20} />
                      </InputIcon>
                      <Input
                        type="email"
                        placeholder="Email"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </InputGroup>

                    <InputGroup>
                      <InputIcon>
                        <Lock size={20} />
                      </InputIcon>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                      <PasswordToggle
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </PasswordToggle>
                    </InputGroup>

                    <InputGroup>
                      <InputIcon>
                        <Lock size={20} />
                      </InputIcon>
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                      <PasswordToggle
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </PasswordToggle>
                    </InputGroup>

                    <SubmitButton type="submit" disabled={isLoading}>
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </SubmitButton>
                  </Form>
                )}

                {error && <ErrorMessage>{error}</ErrorMessage>}
                {success && <SuccessMessage>{success}</SuccessMessage>}
              </FormContainer>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
      {/* 2FA Modal */}
      <TwoFAModal
        email={email}
        isOpen={show2FA}
        onClose={() => setShow2FA(false)}
        onSuccess={() => {
          setShow2FA(false);
          if (pendingUser) {
            setUser({
              id: pendingUser.id,
              email: pendingUser.email,
              name: pendingUser.name || pendingUser.username || pendingUser.email,
              avatar: pendingUser.avatar || undefined,
              profilePic: pendingUser.profilePic || undefined
            });
            setSuccess('Login successful!');
            setEmail("");
            setPassword("");
            setTimeout(() => {
              onClose();
              onSuccess?.();
            }, 1000);
          }
        }}
      />
    </>
  );
};

async function loginUser(email: string, password: string) {
  const { data, error } = await supabase
    .from('Users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Login error:', error.message);
    return { success: false, error: 'Email not found' };
  }

  if (data.password === password) {
    console.log('Login successful:', data);
    // Ensure twoFA property is present
    return { success: true, user: { ...data, twoFA: data["2FA"] ?? data.twoFA } };
  } else {
    console.log('Incorrect password');
    return { success: false, error: 'Incorrect password' };
  }
}

async function registerUser(username : string, email : string, password : string) {
  const { data, error } = await supabase
    .from('Users')
    .insert([{ username, email, password }])
    .select();

  if (error) {
    console.error('Registration error:', error.message);
    return { success: false, error: error.message };
  } else if (!data || !data[0]) {
    return { success: false, error: 'Registration failed: No user returned.' };
  } else {
    console.log('User registered:', data);
    return { success: true, user: data[0] };
  }
}

export default LoginModal; 