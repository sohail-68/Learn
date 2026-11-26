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
  Avatar,
  Divider,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import { getLecturesForCourse } from '../services/lectureService.js';
import { getProgress, updateProgress } from '../api/Proapi.js';

// --- STYLED COMPONENTS ---

const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: '#f8faff', // Softer, cleaner background
  paddingTop: '64px',
  paddingBottom: '64px',
});

const CourseHeader = styled(Box)({
  textAlign: 'center',
  marginBottom: '48px',
});

const MainTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: '#1a1a1a',
  letterSpacing: '-0.5px',
  marginBottom: theme.spacing(1),
  background: 'linear-gradient(45deg, #3f51b5 30%, #00ACC1 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const VideoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '20px',
  border: '1px solid rgba(0,0,0,0.05)',
  boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  overflow: 'hidden',
  backgroundColor: '#ffffff',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 20px 40px -10px rgba(63, 81, 181, 0.15)',
    borderColor: 'rgba(63, 81, 181, 0.2)',
  },
}));

const VideoWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
  backgroundColor: '#0f172a', // Dark background for videos
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const ProgressDashboard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '24px',
  background: 'linear-gradient(135deg, #ffffff 0%, #f3f6ff 100%)',
  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)',
  marginTop: theme.spacing(8),
  border: '1px solid rgba(63, 81, 181, 0.1)',
}));

const StatBox = styled(Box)({
  textAlign: 'center',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

// --- MAIN COMPONENT ---

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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f8faff' }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#3f51b5' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 10 }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>
      </Box>
    );
  }

  return (
    <PageContainer>
      <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 2, sm: 4 } }}>
        
        {/* HEADER */}
        <CourseHeader>
          <MainTitle variant="h3">Course Lectures</MainTitle>
          <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Watch the video lessons, track your progress, and master your skills.
          </Typography>
        </CourseHeader>

        {/* LECTURES GRID */}
        {!lectures.length ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h5" color="textSecondary">No lectures available yet.</Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {lectures.map((lecture) => {
              const isCompleted = progress.completedLectures?.some((l) => l._id === lecture._id);
              return (
                <Grid item xs={12} sm={6} lg={4} key={lecture._id}>
                  <VideoCard>
                    
                    {/* Video Player Area */}
                    <VideoWrapper>
                      {ReactPlayer.canPlay(lecture.video) ? (
                        <ReactPlayer
                          url={`https://lmsb-apt8.onrender.com/${lecture.video.replace(/\\/g, '/')}`}
                          controls
                          width="100%"
                          height="220px"
                        />
                      ) : (
                        <Box sx={{ height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                          <PlayCircleOutlineIcon sx={{ fontSize: 40, mb: 1 }} />
                          <Typography variant="body2">Video not available</Typography>
                        </Box>
                      )}
                    </VideoWrapper>

                    {/* Content Area */}
                    <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" fontWeight="700" color="#1a1a1a" sx={{ mb: 1, lineHeight: 1.3 }}>
                        {lecture.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 2, flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {lecture.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: '#e0e7ff', color: '#3f51b5', mr: 1 }}>
                          <PersonIcon sx={{ fontSize: 16 }} />
                        </Avatar>
                        <Typography variant="caption" fontWeight="500" color="textSecondary">
                          {lecture.createdBy?.name || 'Instructor'}
                        </Typography>
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      {/* Action Button */}
                      {isCompleted ? (
                        <Button 
                          variant="outlined" 
                          color="success" 
                          fullWidth 
                          disabled
                          startIcon={<CheckCircleIcon />}
                          sx={{ borderRadius: '12px', py: 1, fontWeight: 600 }}
                        >
                          Completed
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => markLectureComplete(lecture._id)}
                          sx={{ 
                            borderRadius: '12px', 
                            py: 1, 
                            fontWeight: 600,
                            backgroundColor: '#3f51b5',
                            boxShadow: '0 4px 14px 0 rgba(63, 81, 181, 0.3)',
                            '&:hover': { backgroundColor: '#303f9f' }
                          }}
                        >
                          Mark as Complete
                        </Button>
                      )}
                    </CardContent>
                  </VideoCard>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* MODERN PROGRESS DASHBOARD */}
        <ProgressDashboard elevation={0}>
          <Grid container alignItems="center" spacing={4}>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h5" fontWeight="700" color="#1a1a1a" gutterBottom>
                Your Learning Progress
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                You've completed <strong>{progress.completedCount}</strong> out of <strong>{progress.totalLectures}</strong> lectures. Keep going!
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body1" fontWeight="bold" color="#3f51b5">
                  {Math.round(progress.progressPercentage || 0)}%
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  {progress.totalLectures - progress.completedCount} lessons left
                </Typography>
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={isNaN(progress.progressPercentage) ? 0 : progress.progressPercentage}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#e0e7ff',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 6,
                    background: 'linear-gradient(90deg, #3f51b5 0%, #00ACC1 100%)',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', bgcolor: '#fff', p: 2, borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <StatBox>
                  <Typography variant="h4" fontWeight="800" color="#3f51b5">
                    {progress.completedCount}
                  </Typography>
                  <Typography variant="caption" fontWeight="600" color="textSecondary">
                    COMPLETED
                  </Typography>
                </StatBox>
                <Divider orientation="vertical" flexItem />
                <StatBox>
                  <Typography variant="h4" fontWeight="800" color="#00ACC1">
                    {progress.totalLectures}
                  </Typography>
                  <Typography variant="caption" fontWeight="600" color="textSecondary">
                    TOTAL
                  </Typography>
                </StatBox>
              </Box>
            </Grid>

          </Grid>
        </ProgressDashboard>

      </Box>

      {/* Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbarSeverity} onClose={handleCloseSnackbar} sx={{ width: '100%', borderRadius: '12px', fontWeight: 600 }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default Lect;
