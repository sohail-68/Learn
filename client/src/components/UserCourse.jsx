import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserCourse = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await fetch('https://learn-rd8o.onrender.com/api/auth/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setProfile(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleNavigation = (id) => navigate(`/user/lect/${id}`);
  const handleQuiz = (id) => navigate(`/user/quuize/${id}`);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f0f4f8',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h6"
          align="center"
          fontWeight="bold"
          mb={4}
          sx={{ color: '#1e3a8a' }}
        >
          📚 My Courses
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!profile ? (
          <Box display="flex" justifyContent="center" mt={8}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography
              variant="h5"
              align="center"
              mb={5}
              sx={{ color: '#475569', fontWeight: '500' }}
            >
              🎓 Enrolled Courses: {profile.enrolledCourses?.length || 0}
            </Typography>

            <Grid container spacing={4}>
              {profile.enrolledCourses?.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course._id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      boxShadow: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={`https://learn-rd8o.onrender.com/${course.courseThumbnail}`}
                      alt={course.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ color: '#1e3a8a' }}
                      >
                        🎯 {course.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" mb={1}>
                        {course.description.length > 60
                          ? `${course.description.slice(0, 60)}...`
                          : course.description}
                      </Typography>

                      <Chip
                        label={`📂 ${course.category}`}
                        sx={{ backgroundColor: '#e2e8f0', mb: 1 }}
                      />

                      <Typography variant="subtitle2" color="#334155" mb={1}>
                        📈 Level: {course.courseLevel}
                      </Typography>

                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ color: '#1e3a8a' }}
                        mb={2}
                      >
                        💰 {course.coursePrice > 0 ? `₹${course.coursePrice}` : '🎉 Free'}
                      </Typography>

                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          backgroundColor: '#1e3a8a',
                          textTransform: 'none',
                          mb: 1,
                          py: 1,
                          '&:hover': {
                            backgroundColor: '#143074',
                          },
                        }}
                        onClick={() => handleNavigation(course._id)}
                      >
                        🚀 Show Lectures
                      </Button>

                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{
                          textTransform: 'none',
                          py: 1,
                          borderColor: '#1e3a8a',
                          color: '#1e3a8a',
                          '&:hover': {
                            backgroundColor: '#e0e7ff',
                            borderColor: '#1e3a8a',
                          },
                        }}
                        onClick={() => handleQuiz(course._id)}
                      >
                        🧠 Take Quiz
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};

export default UserCourse;
