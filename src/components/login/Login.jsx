import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import loginImage from '../../assets/GoldBar.jpg';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === 'aurify@gmail.com' && password === 'Aurify@123') {
      navigate('/dashboard');
    } else {
      alert('Invalid email or password');
    }
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'white', overflow: 'hidden' }}>
      {/* Left side - Login Form */}
      <div style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '8rem' }}>
        <div style={{ width: '100%', maxWidth: '20rem' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            background: 'linear-gradient(310deg, #2152ff 0%, #21d4fd 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Welcome back</h2>
          <p style={{ color: '#718096', marginBottom: '2rem' }}>Enter your email and password to sign in</p>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4a5568', marginBottom: '0.5rem' }}>Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  border: '1px solid #d2d6dc', 
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  color: '#2d3748'
                }} 
                placeholder="test@gmail.com" 
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4a5568', marginBottom: '0.5rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"}
                  id="password" 
                  name="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    paddingRight: '2.5rem', // Make room for the icon
                    border: '1px solid #d2d6dc', 
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    color: '#2d3748'
                  }} 
                  placeholder="••••••" 
                />
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePasswordVisibility}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <Switch
                checked={rememberMe}
                onChange={handleRememberMeChange}
                inputProps={{ 'aria-label': 'controlled' }}
                style={{ color: '#2152ff' }}
              />
              <label htmlFor="rememberMe" style={{ fontSize: '0.875rem', color: '#718096' }}>Remember me</label>
            </div>
            
            <button type="submit" style={{ 
              width: '100%', 
              padding: '0.5rem', 
              borderRadius: '0.375rem', 
              background: 'linear-gradient(310deg, #2152ff 0%, #21d4fd 100%)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              SIGN IN
            </button>
          </form>
          
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#718096', textAlign: 'center' }}>
            Don't have an account? <a href="#" style={{ color: '#2152ff', textDecoration: 'underline' }}>Contact us</a>
          </p>
        </div>
      </div>
      
      {/* Right side - Gold Image */}
      <div style={{ position: 'relative', width: '50%', height: '100%', overflow: 'hidden' }}>
        <div 
          style={{
            position: 'absolute', 
            top: '0', 
            height: '110%', 
            width: '100%', 
            right: '-10rem', 
            left: 'auto',
            transform: 'skewX(-10deg)', 
            overflow: 'hidden', 
            borderBottomLeftRadius: '1rem',
            backgroundImage: `url(${loginImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
        </div>
      </div>
    </div>
  );
};

export default LoginPage;