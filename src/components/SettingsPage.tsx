import React, { useState, ChangeEvent, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../../backend/supabaseClient';
import { useNavigate } from 'react-router-dom';

const dropdownStyle: React.CSSProperties = {
  width: 400,
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
  padding: 24,
  zIndex: 2001,
  marginTop: 96,
  marginLeft: 'auto',
  marginRight: 'auto',
};

const avatarStyle: React.CSSProperties = {
  width: 80,
  height: 80,
  borderRadius: '50%',
  objectFit: 'cover',
  display: 'block',
  margin: '0 auto 12px auto',
  border: '2px solid #EFC0C2',
};

const SettingsPage: React.FC = () => {
  const { user, updateUser, setUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.profilePic || user?.avatar || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [twoFA, setTwoFA] = useState(user?.twoFA ?? false);

  // Fetch user info from DB on mount (or when user.email changes)
  useEffect(() => {
    const fetchUserFromDB = async () => {
      if (!user?.email) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('email', user.email)
        .single();
      setLoading(false);
      if (error || !data) return;
      setName(data.name || '');
      setEmail(data.email || '');
      setAvatarUrl(data.profilePic || data.avatar || '');
      setTwoFA(data["2FA"] ?? data.twoFA ?? false);
      // Update context as well
      updateUser({ ...user, ...data });
    };
    fetchUserFromDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  // Redirect to home if user logs out
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return <div style={{ padding: 32 }}>You must be logged in to view account settings.</div>;
  }

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setAvatarFile(file);
    setAvatarUploading(true);
    setError('');
    setSuccess('');

    // Delete old avatar if it exists and is in the avatars bucket
    if (user.profilePic && user.profilePic.includes('/storage/v1/object/public/avatars/')) {
      // Extract the file name from the URL
      const oldFileName = user.profilePic.split('/').pop();
      if (oldFileName) {
        await supabase.storage.from('avatars').remove([oldFileName]);
      }
    }

    // Upload new avatar
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    const { data, error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      setError('Failed to upload profile picture.');
      setAvatarUploading(false);
      return;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
    const publicUrl = publicUrlData?.publicUrl;
    if (!publicUrl) {
      setError('Failed to get profile picture URL.');
      setAvatarUploading(false);
      return;
    }

    // Update the Users table with the new profilePic URL
    const { error: dbError } = await supabase
      .from('Users')
      .update({ profilePic: publicUrl })
      .eq('email', user.email);
    setAvatarUploading(false);
    if (dbError) {
      setError('Failed to update profile picture in database.');
    } else {
      setAvatarUrl(publicUrl);
      updateUser({ ...user, profilePic: publicUrl });
      setSuccess('Profile picture updated!');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name.trim()) {
      setError('Username cannot be empty');
      return;
    }
    setLoading(true);
    
    try {
      // Check if user exists first
      const { data: existingUser, error: checkError } = await supabase
        .from('Users')
        .select('*')
        .eq('email', user.email.trim())
        .single();

      if (checkError) {
        setError(`User not found in database. Error: ${checkError.message}`);
        return;
      }

      if (!existingUser) {
        setError('User not found in database');
        return;
      }

    // Update username in Supabase Users table
    const { data, error } = await supabase
  .from('Users')
  .update({ username: name })
        .eq('email', user.email.trim())
        .select('*');

    if (error) {
        setError(`Failed to update username: ${error.message}`);
      } else if (data && data.length > 0) {
        // Update local user state
        const updatedUser = { ...user, name: name };
        updateUser(updatedUser);
        setSuccess('Username updated successfully!');
    } else {
        setError('No user found with that email address');
      }
    } catch (err) {
      setError('An unexpected error occurred while updating username');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email.trim()) {
      setError('Email cannot be empty');
      return;
    }
    setLoading(true);
    
    try {
      // Check if user exists first
      const { data: existingUser, error: checkError } = await supabase
        .from('Users')
        .select('*')
        .eq('email', user.email.trim())
        .single();

      if (checkError) {
        setError(`User not found in database. Error: ${checkError.message}`);
        return;
      }

      if (!existingUser) {
        setError('User not found in database');
        return;
      }

    // Update email in Supabase Users table
      const { data, error } = await supabase
      .from('Users')
        .update({ email: email.trim() })
        .eq('email', user.email.trim())
        .select('*');
      
      if (error) {
        setError(`Failed to update email: ${error.message}`);
      } else if (data && data.length > 0) {
        // Update local user state
        const updatedUser = { ...user, email: email.trim() };
        updateUser(updatedUser);
        setSuccess('Email updated successfully!');
      } else {
        setError('No user found with that email address');
      }
    } catch (err) {
      setError('An unexpected error occurred while updating email');
    } finally {
    setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    
    try {
      // Check if user exists first
      const { data: existingUser, error: checkError } = await supabase
        .from('Users')
        .select('*')
        .eq('email', user.email.trim())
        .single();

      if (checkError) {
        setError(`User not found in database. Error: ${checkError.message}`);
        return;
      }

      if (!existingUser) {
        setError('User not found in database');
        return;
      }

      // Update password in Supabase Users table
      const { data, error } = await supabase
        .from('Users')
        .update({ password })
        .eq('email', user.email.trim())
        .select('*');
      
      if (error) {
        setError(`Failed to update password: ${error.message}`);
      } else if (data && data.length > 0) {
      setPassword('');
      setConfirmPassword('');
        setSuccess('Password updated successfully!');
      } else {
        setError('No user found with that email address');
      }
    } catch (err) {
      setError('An unexpected error occurred while updating password');
    } finally {
      setLoading(false);
    }
  };

  // Remove avatar handler
  const handleRemoveAvatar = async () => {
    setError('');
    setSuccess('');
    setAvatarUploading(true);
    // Delete old avatar if it exists and is in the avatars bucket
    if (user.profilePic && user.profilePic.includes('/storage/v1/object/public/avatars/')) {
      const oldFileName = user.profilePic.split('/').pop();
      if (oldFileName) {
        await supabase.storage.from('avatars').remove([oldFileName]);
      }
    }
    // Set profilePic to null in Users table
    const { error: dbError } = await supabase
      .from('Users')
      .update({ profilePic: null })
      .eq('email', user.email);
    setAvatarUploading(false);
    if (dbError) {
      setError('Failed to remove profile picture in database.');
    } else {
      setAvatarUrl('');
      updateUser({ ...user, profilePic: undefined });
      setSuccess('Profile picture removed!');
    }
  };

  const handleToggle2FA = async () => {
    // If disabling, confirm with the user
    if (twoFA) {
      const confirmed = window.confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.');
      if (!confirmed) return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    const newTwoFA = !twoFA;
    const { error } = await supabase
      .from('Users')
      .update({ "2FA": newTwoFA })
      .eq('email', user.email);
    setLoading(false);
    if (error) {
      setError('Failed to update 2FA setting.');
    } else {
      setTwoFA(newTwoFA);
      updateUser({ ...user, twoFA: newTwoFA });
      setSuccess(`Two-factor authentication ${newTwoFA ? 'enabled' : 'disabled'}!`);
      if (newTwoFA) {
        window.alert('Two-factor authentication enabled! You will now receive verification emails each time you log in.');
      }
    }
  };

  return (
    <div style={dropdownStyle}>
      <h2 style={{ textAlign: 'center' }}>Account Settings</h2>
      {}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <img
          src={avatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || user.email)}
          alt="Profile"
          style={avatarStyle}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 12 }}>
        <input
            id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          disabled={avatarUploading}
            style={{ display: 'none' }}
          />
          <label htmlFor="avatar-upload" style={{
            background: '#EFC0C2',
            color: '#fff',
            borderRadius: 6,
            padding: '8px 16px',
            cursor: avatarUploading ? 'not-allowed' : 'pointer',
            marginBottom: 0,
            fontWeight: 600,
            border: 'none',
            display: 'inline-block'
          }}>
            Choose File
          </label>
          <button
            type="button"
            onClick={handleRemoveAvatar}
            disabled={avatarUploading || !user.profilePic}
            style={{ marginTop: 12, background: '#eee', color: '#c00', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: user.profilePic ? 'pointer' : 'not-allowed' }}
          >
            Remove Avatar
          </button>
        </div>
        {avatarUploading && <div style={{ color: '#EFC0C2' }}>Uploading...</div>}
      </div>
      <form onSubmit={handleUpdateProfile} style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', marginBottom: 8 }}>Username</label>
        <input
          type="text"
          value={user?.name || ''}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 12 }}
        />
        <button type="submit" style={{ width: '100%', padding: 10, background: '#EFC0C2', color: '#fff', border: 'none', borderRadius: 6 }} disabled={loading}>Update Username</button>
      </form>
      <form onSubmit={handleUpdateEmail} style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', marginBottom: 8 }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 12 }}
        />
        <button type="submit" style={{ width: '100%', padding: 10, background: '#EFC0C2', color: '#fff', border: 'none', borderRadius: 6 }} disabled={loading}>Update Email</button>
      </form>
      <form onSubmit={handleUpdatePassword}>
        <label style={{ display: 'block', marginBottom: 8 }}>New Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 12 }}
        />
        <label style={{ display: 'block', marginBottom: 8 }}>Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 12 }}
        />
        <button type="submit" style={{ width: '100%', padding: 10, background: '#EFC0C2', color: '#fff', border: 'none', borderRadius: 6 }} disabled={loading}>Update Password</button>
      </form>
      <div style={{ margin: '24px 0', padding: '16px', background: '#f9f9f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 600 }}>Two-Factor Authentication (2FA)</span>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={twoFA}
            onChange={handleToggle2FA}
            disabled={loading}
            style={{ width: 20, height: 20 }}
          />
          {twoFA ? 'Enabled' : 'Disabled'}
        </label>
      </div>
      {success && <div style={{ color: '#27ae60', marginTop: 16 }}>{success}</div>}
      {error && <div style={{ color: '#e74c3c', marginTop: 16 }}>{error}</div>}
    </div>
  );
};

export default SettingsPage; 