import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Box,
  Button,
  IconButton,
  Drawer,
  TextField,
  Stack,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm, fetchCourses } from '../store/features/searchSlice';
import { toast } from 'react-toastify';
import Path from '../images/Path.png';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchTerm, loading, courses } = useSelector((state) => state.search);

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.warn('Please enter a valid search term.');
      return;
    }
    navigate(`/user/search?term=${encodeURIComponent(searchTerm)}`);
    dispatch(fetchCourses(searchTerm));
    dispatch(setSearchTerm(''));
  };

  const logoutUser = async () => {
    try {
      const response = await fetch('https://learn-rd8o.onrender.com/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        localStorage.removeItem('token');
        toast.success('Logout successful');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        toast.error('Logout failed');
      }
    } catch (err) {
      toast.error('Error logging out');
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={3}
      sx={{
        backgroundColor: '#f5f7fa',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <Link to="/user">
          <img
            src={Path}
            alt="Logo"
            style={{
              width: '2rem',
              objectFit: 'cover',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          />
        </Link>

        {/* Search & Nav Links (Large Screens) */}
     <Box
  sx={{
    display: { xs: 'none', lg: 'flex' },
    alignItems: 'center',
    gap: 2,
    flexBasis: '1',
    // flexWrap: 'wrap',
  }}
>
  {/* Search Field */}
  <TextField
    size="small"
    placeholder="Search courses..."
    variant="outlined"
    value={searchTerm}
    onChange={(e) => dispatch(setSearchTerm(e.target.value))}
    sx={{ minWidth: 500 }}
  />

  {/* Search Button */}
<Button
  variant="contained"
  onClick={handleSearch}
  startIcon={<SearchIcon />}
  disabled={loading}
  sx={{
    backgroundColor: '#1e3a8a',
    textTransform: 'none',
    whiteSpace: 'nowrap',
    width: '14rem', // Increased width
    fontSize: '1rem',
    paddingX: 6,
    '&:hover': {
      backgroundColor: '#162e6a',
    },
  }}
>
  {loading ? 'Searching...' : 'Search'}
</Button>


  {/* Nav Links */}
  <NavLink icon={<SchoolIcon />} label="Courses" to="/user/course" />
  <NavLink icon={<FavoriteIcon />} label="Wishlist" to="/user/wish" />
  <NavLink icon={<AccountCircleIcon />} label="Profile" to="/user/profile" />

  {/* Logout */}
  <Button
    onClick={logoutUser}
    startIcon={<LogoutIcon />}
    sx={{
      textTransform: 'none',
      color: '#1e3a8a',
      fontWeight: 600,
      whiteSpace: 'nowrap',
    }}
  >
    Logout
  </Button>
</Box>
<Box sx={{
  display:{md:'none',xs:"flex"},
  gap:"0.3rem"

}}>
    <TextField
    size="small"
    placeholder="Search courses..."
    variant="outlined"
    value={searchTerm}
    onChange={(e) => dispatch(setSearchTerm(e.target.value))}
    sx={{ width: "10rem" }}
  />
  <Button
  variant="contained"
  onClick={handleSearch}
  // startIcon={<SearchIcon />}
  disabled={loading}
  sx={{
    backgroundColor: '#1e3a8a',
    textTransform: 'none',
    whiteSpace: 'nowrap',
    width: '2rem', // Increased width
    fontSize: '1rem',
    paddingX: 3,
    '&:hover': {
      backgroundColor: '#162e6a',
    },
  }}
>
  {loading ? 'Searching...' : 'Search'}
</Button>
</Box>


        {/* Hamburger Icon (Mobile) */}
        <IconButton
          sx={{ display: { xs: 'block', lg: 'none' } }}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon sx={{ color: '#1e3a8a' }} />
        </IconButton>
      </Toolbar>

      {/* Drawer Menu (Mobile View) */}
      <Drawer
  anchor="right"
  open={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  PaperProps={{
    sx: {
      width: 280,
      padding: 3,
      backgroundColor: '#f9fafb',
      boxShadow: 4,
    },
  }}
>
  {/* Close Button */}
  <Box display="flex" justifyContent="flex-end">
    <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#1e3a8a' }}>
      <CloseIcon />
    </IconButton>
  </Box>

  {/* Navigation Links */}
  <Stack spacing={2} mt={3}>
    <NavLink
      icon={<SchoolIcon sx={{ color: '#1e3a8a' }} />}
      label="Courses"
      to="/user/course"
      onClick={() => setDrawerOpen(false)}
    />
    <NavLink
      icon={<FavoriteIcon sx={{ color: '#1e3a8a' }} />}
      label="Wishlist"
      to="/user/wish"
      onClick={() => setDrawerOpen(false)}
    />
    <NavLink
      icon={<AccountCircleIcon sx={{ color: '#1e3a8a' }} />}
      label="Profile"
      to="/user/profile"
      onClick={() => setDrawerOpen(false)}
    />
    <NavLink
      icon={<LoginIcon sx={{ color: '#1e3a8a' }} />}
      label="Login"
      to="/login"
      onClick={() => setDrawerOpen(false)}
    />

    {/* Logout Button */}
    <Button
      startIcon={<LogoutIcon />}
      sx={{
        textTransform: 'none',
        color: '#ffffff',
        backgroundColor: '#1e3a8a',
        fontWeight: 600,
        borderRadius: 2,
        paddingY: 1,
        '&:hover': {
          backgroundColor: '#162e6a',
        },
      }}
      onClick={() => {
        logoutUser();
        setDrawerOpen(false);
      }}
    >
      Logout
    </Button>
  </Stack>
</Drawer>

    </AppBar>
  );
};

const NavLink = ({ icon, label, to, onClick }) => (
  <Button
    component={Link}
    to={to}
    onClick={onClick}
    startIcon={icon}
    sx={{
      textTransform: 'none',
      color: '#1e3a8a',
      fontWeight: 600,
      justifyContent: 'flex-start',
      width: '100%',
      '&:hover': {
        backgroundColor: '#e3eaf2',
      },
    }}
  >
    {label}
  </Button>
);

export default Navbar;
