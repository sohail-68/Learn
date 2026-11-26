import React, { useEffect, useState, useCallback } from 'react';
import ReactPlayer from 'react-player';
import {
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Box,
  Snackbar,
  LinearProgress,
  Paper,
  styled,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { getLecturesForCourse } from '../services/lectureService.js';
import { getProgress, updateProgress } from '../api/Proapi.js';

const ProgressCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  textAlign: 'center',
  background: '#fff',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
}));

const Lect = () => {
  const { id: courseId } = useParams();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [progress, setProgress] = useState({
    completedCount: 0,
    totalLectures: 0,
    progressPercentage: 0,
    completedLectures: [],
  });

  const fetchProgress = useCallback(async () => {
    try {
      const data = await getProgress(courseId);
      setProgress(data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  }, [courseId]);

  const fetchLectures = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const data = await getLecturesForCourse(courseId, token);
      setLectures(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load lectures');
      setLoading(false);
    }
  }, [courseId]);

  const markLectureComplete = async (lectureId) => {
    try {
      await updateProgress(courseId, lectureId);
      fetchProgress();
      setSnackbarMessage('Lecture marked as complete!');
      setSnackbarSeverity('success');
    } catch (err) {
      setSnackbarMessage('Failed to update progress.');
      setSnackbarSeverity('error');
    }
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  useEffect(() => {
    if (courseId) {
      fetchProgress();
      fetchLectures();
    }
  }, [courseId, fetchProgress, fetchLectures]);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!lectures.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="textSecondary">
          No lectures found for this course.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: 6,
        px: { xs: 2, sm: 4 },
        background: 'linear-gradient(135deg, #f3f4f6, #e0e7ff)',
        minHeight: '100vh',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#3f51b5',
          mb: 5,
        }}
      >
        Lectures for Course
      </Typography>

      <Grid container spacing={4}>
        {lectures.map((lecture) => (
          <Grid item xs={12} sm={6} md={4} key={lecture._id}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderRadius: 3,
                boxShadow: 4,
                overflow: 'hidden',
                transition: '0.3s',
                '&:hover': {
                  boxShadow: 10,
                },
              }}
            >
              {ReactPlayer.canPlay(lecture.video) ? (
                <ReactPlayer
                  url={`https://lmsb-apt8.onrender.com/${lecture.video.replace(/\\/g, '/')}`}
                  controls
                  width="100%"
                  height="200px"
                />
              ) : (
                <Box
                  sx={{
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#e0e0e0',
                  }}
                >
                  <Typography color="textSecondary">Video not available</Typography>
                </Box>
              )}

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  {lecture.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  {lecture.description}
                </Typography>
                <Chip
                  label={`Created by: ${lecture.createdBy?.name || 'Unknown'}`}
                  color="primary"
                  size="small"
                  sx={{ mb: 2 }}
                />
                {progress.completedLectures?.some((l) => l._id === lecture._id) ? (
                  <Button variant="contained" color="success" fullWidth disabled>
                    ✅ Completed
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => markLectureComplete(lecture._id)}
                  >
                    Mark as Complete
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Course Progress Section */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#3f51b5',
            mb: 3,
          }}
        >
          Course Progress
        </Typography>

        <Box sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          <LinearProgress
            variant="determinate"
            value={isNaN(progress.progressPercentage) ? 0 : progress.progressPercentage}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: '#d1c4e9',
              '& .MuiLinearProgress-bar': { backgroundColor: '#3f51b5' },
            }}
          />
          <Typography textAlign="center" fontWeight="bold" mt={1}>
            {Math.round(progress.progressPercentage || 0)}% Complete
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <ProgressCard>
              <Typography variant="h6" color="textSecondary">
                ✅ Completed
              </Typography>
              <Typography variant="h3" color="primary">
                {progress.completedCount}
              </Typography>
            </ProgressCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <ProgressCard>
              <Typography variant="h6" color="textSecondary">
                📚 Total Lectures
              </Typography>
              <Typography variant="h3" color="secondary">
                {progress.totalLectures}
              </Typography>
            </ProgressCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <ProgressCard>
              <Typography variant="h6" color="textSecondary">
                🎯 Progress
              </Typography>
              <Typography variant="h3" sx={{ color: '#00ACC1' }}>
                {Math.round(progress.progressPercentage || 0)}%
              </Typography>
            </ProgressCard>
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}>
        <Alert
          severity={snackbarSeverity}
          onClose={handleCloseSnackbar}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Lect;
