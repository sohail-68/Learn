import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUserStart, registerUserSuccess, registerUserFailure } from '../Auth/Authslice';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(registerUserStart());

    try {
      const { data } = await axios.post('https://learn-rd8o.onrender.com/api/auth/register', formData);
      localStorage.setItem('userid', data.user._id);
      dispatch(registerUserSuccess(data.user));
      navigate('/'); // Redirect after success
    } catch (error) {
      dispatch(registerUserFailure(error.response?.data?.message || error.message));
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: 'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)',
        px: 3,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 450,
          bgcolor: '#fff',
          borderRadius: 3,
          p: 5,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#333', mb: 2 }}>
          Create Account
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Sign up to get started
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <TextField
          fullWidth
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          variant="outlined"
          margin="normal"
          required
          InputProps={{ style: { backgroundColor: '#f9f9f9' } }}
        />

        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          variant="outlined"
          margin="normal"
          required
          InputProps={{ style: { backgroundColor: '#f9f9f9' } }}
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleInputChange}
          variant="outlined"
          margin="normal"
          required
          InputProps={{
            style: { backgroundColor: '#f9f9f9' },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{
            mt: 3,
            py: 1.5,
            fontWeight: 'bold',
            fontSize: '1rem',
            textTransform: 'none',
            background: 'linear-gradient(45deg, #6a11cb, #2575fc)',
            '&:hover': {
              background: 'linear-gradient(45deg, #6a11cb, #5B86E5)',
            },
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
        </Button>


       

        <Typography variant="body2" mt={3} color="textSecondary">
          Already have an account?{' '}
          <Button
            variant="text"
            size="small"
            sx={{ color: '#6a11cb', fontWeight: 'bold', textTransform: 'none' }}
            onClick={() => navigate('/login')}
          >
            Log In
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default Signup;
