import React, { useEffect, useState } from "react";
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
  Avatar,
  Stack,
  IconButton,
  TextField,
  InputAdornment,
  Skeleton,
  LinearProgress,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  School,
  PlayCircleOutline,
  Quiz,
  Search,
  ArrowForward,
  MenuBook,
  WorkspacePremium,
  PeopleAlt,
  AccessTime,
  Explore,
  Star,
  Language,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ─── Theme Tokens (matches whole LMS) ───
const COLORS = {
  primary: "#4f46e5",
  primaryDark: "#4338ca",
  accent: "#8b5cf6",
  text: "#0f172a",
  textMuted: "#64748b",
  gradient: "linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)",
  shadow: "rgba(79, 70, 229, 0.25)",
};

const API_BASE = "https://lmsb-apt8.onrender.com";

const UserCourse = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // ─── Fetch Profile ───
  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setProfile(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ─── Image URL helper ───
  const getImageUrl = (thumb) => {
    if (!thumb) return "";
    return `${API_BASE}/${thumb.replace(/\\/g, "/")}`;
  };

  // ─── Navigation ───
  const handleNavigation = (id) => navigate(`/user/lect/${id}`);
  const handleQuiz = (id) => navigate(`/user/quuize/${id}`);

  // ─── Filter courses by search ───
  const filteredCourses = (profile?.enrolledCourses || []).filter((course) =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ═══════════ LOADING ═══════════
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
          py: { xs: 4, md: 6 },
          px: { xs: 2, md: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Skeleton variant="rounded" height={50} width={200} sx={{ mb: 3, borderRadius: "10px" }} />
          <Skeleton variant="rounded" height={40} width={300} sx={{ mb: 4 }} />
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rounded" height={380} sx={{ borderRadius: "20px" }} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  // ═══════════ MAIN RENDER ═══════════
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #faf5ff 100%)",
        py: { xs: 4, md: 6 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Background Orbs */}
      <Box
        component={motion.div}
        animate={{ x: [0, 30, -30, 0], y: [0, -30, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: { xs: 200, md: 400 },
          height: { xs: 200, md: 400 },
          background:
            "radial-gradient(circle, rgba(79,70,229,0.18) 0%, rgba(79,70,229,0) 70%)",
          borderRadius: "50%",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />
      <Box
        component={motion.div}
        animate={{ x: [0, -25, 25, 0], y: [0, 25, -25, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          bottom: "-10%",
          right: "-5%",
          width: { xs: 240, md: 450 },
          height: { xs: 240, md: 450 },
          background:
            "radial-gradient(circle, rgba(139,92,246,0.18) 0%, rgba(139,92,246,0) 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        {/* ═══ Header Section ═══ */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{ mb: { xs: 4, md: 5 } }}
        >
          {/* Eyebrow */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.6,
              mb: 2,
              borderRadius: "50px",
              background: "rgba(79, 70, 229, 0.1)",
              border: "1px solid rgba(79, 70, 229, 0.2)",
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: COLORS.primary,
                boxShadow: `0 0 8px ${COLORS.primary}`,
              }}
            />
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: COLORS.primary,
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              My Learning
            </Typography>
          </Box>

          {/* Title + subtitle */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  lineHeight: 1.1,
                  letterSpacing: "-1.5px",
                  color: COLORS.text,
                  mb: 1,
                }}
              >
                My{" "}
                <Box
                  component="span"
                  sx={{
                    background: COLORS.gradient,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Courses
                </Box>
              </Typography>
              <Typography sx={{ color: COLORS.textMuted, fontSize: "0.95rem" }}>
                Continue your learning journey — you're doing great! 🚀
              </Typography>
            </Box>

            {/* Stats badge */}
            <Chip
              icon={<School sx={{ fontSize: "18px !important", color: `${COLORS.primary} !important` }} />}
              label={`${profile?.enrolledCourses?.length || 0} Courses Enrolled`}
              sx={{
                background: "#fff",
                color: COLORS.text,
                fontWeight: 700,
                fontSize: "0.85rem",
                py: 2.5,
                px: 1.5,
                borderRadius: "12px",
                boxShadow: "0 4px 16px rgba(15, 23, 42, 0.06)",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                "& .MuiChip-label": { fontSize: "0.85rem", fontWeight: 700 },
              }}
            />
          </Box>

          {/* Search bar */}
          {profile?.enrolledCourses?.length > 0 && (
            <TextField
              fullWidth
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: COLORS.textMuted, fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: { xs: "100%", sm: 500 },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  fontSize: "0.9rem",
                  boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
                  "& fieldset": { borderColor: "transparent" },
                  "&:hover fieldset": { borderColor: "#cbd5e1" },
                  "&.Mui-focused fieldset": { borderColor: COLORS.primary },
                },
              }}
            />
          )}
        </Box>

        {/* ═══ Error ═══ */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: "12px", maxWidth: 700, mx: "auto" }}
          >
            {error}
          </Alert>
        )}

        {/* ═══ Empty State ═══ */}
        {profile && profile.enrolledCourses?.length === 0 && (
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              borderRadius: "24px",
              p: { xs: 4, md: 8 },
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(10px)",
              border: "1px dashed #cbd5e1",
              maxWidth: 600,
              mx: "auto",
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "rgba(79, 70, 229, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <MenuBook sx={{ fontSize: 48, color: COLORS.primary }} />
            </Box>
            <Typography
              sx={{ fontWeight: 800, fontSize: "1.4rem", color: COLORS.text, mb: 1 }}
            >
              No courses yet
            </Typography>
            <Typography sx={{ color: COLORS.textMuted, fontSize: "0.95rem", mb: 4, maxWidth: 400, mx: "auto" }}>
              You haven't enrolled in any course yet. Browse our catalog and start your learning journey today!
            </Typography>
            <Button
              variant="contained"
              endIcon={<Explore />}
              onClick={() => navigate("/user/course")}
              sx={{
                background: COLORS.gradient,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "1rem",
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                boxShadow: `0 8px 24px ${COLORS.shadow}`,
                "&:hover": {
                  background: "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
                  boxShadow: `0 12px 32px ${COLORS.shadow}`,
                },
              }}
            >
              Explore Courses
            </Button>
          </Card>
        )}

        {/* ═══ No Search Results ═══ */}
        {profile?.enrolledCourses?.length > 0 && filteredCourses.length === 0 && (
          <Card
            sx={{
              borderRadius: "20px",
              p: 5,
              textAlign: "center",
              background: "#fff",
              border: "1px dashed #cbd5e1",
            }}
          >
            <Search sx={{ fontSize: 48, color: "#cbd5e1", mb: 1 }} />
            <Typography sx={{ fontWeight: 700, color: COLORS.text, mb: 0.5 }}>
              No courses match "{searchTerm}"
            </Typography>
            <Typography sx={{ color: COLORS.textMuted, fontSize: "0.9rem" }}>
              Try a different search term
            </Typography>
          </Card>
        )}

        {/* ═══ Courses Grid ═══ */}
        {filteredCourses.length > 0 && (
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {filteredCourses.map((course, index) => (
              <Grid item xs={12} sm={6} lg={4} key={course._id}>
                <Card
                  component={motion.div}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  sx={{
                    height: "100%",
                    borderRadius: "20px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    background: "#fff",
                    boxShadow: "0 4px 20px rgba(15, 23, 42, 0.06)",
                    border: "1px solid rgba(226, 232, 240, 0.8)",
                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: `0 20px 40px ${COLORS.shadow}`,
                      "& .course-image": { transform: "scale(1.08)" },
                    },
                  }}
                >
                  {/* ─── Image ─── */}
                  <Box
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      height: 180,
                      cursor: "pointer",
                    }}
                    onClick={() => handleNavigation(course._id)}
                  >
                    <CardMedia
                      className="course-image"
                      component="img"
                      image={getImageUrl(course.courseThumbnail)}
                      alt={course.title}
                      sx={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                        transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(15,23,42,0.75) 0%, transparent 60%)",
                      }}
                    />

                    {/* Enrolled badge */}
                    <Chip
                      icon={<School sx={{ fontSize: "14px !important", color: "#fff !important" }} />}
                      label="Enrolled"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        background: "rgba(16, 185, 129, 0.9)",
                        backdropFilter: "blur(10px)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        border: "1px solid rgba(255,255,255,0.3)",
                      }}
                    />

                    {/* Play overlay */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 54,
                        height: 54,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.95)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                        opacity: 0,
                        transition: "opacity 0.3s",
                        ".MuiCard-root:hover &": { opacity: 1 },
                      }}
                    >
                      <PlayCircleOutline sx={{ fontSize: 30, color: COLORS.primary }} />
                    </Box>

                    {/* Category + Level chips */}
                    <Stack
                      direction="row"
                      spacing={0.8}
                      sx={{ position: "absolute", bottom: 12, left: 12 }}
                    >
                      {course.category && (
                        <Chip
                          label={course.category}
                          size="small"
                          sx={{
                            background: "rgba(255,255,255,0.25)",
                            backdropFilter: "blur(10px)",
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "0.68rem",
                            border: "1px solid rgba(255,255,255,0.3)",
                            height: 22,
                          }}
                        />
                      )}
                      {course.courseLevel && (
                        <Chip
                          label={course.courseLevel}
                          size="small"
                          sx={{
                            background: "rgba(255,255,255,0.25)",
                            backdropFilter: "blur(10px)",
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "0.68rem",
                            border: "1px solid rgba(255,255,255,0.3)",
                            height: 22,
                          }}
                        />
                      )}
                    </Stack>
                  </Box>

                  {/* ─── Content ─── */}
                  <CardContent
                    sx={{
                      p: 2.5,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      "&:last-child": { pb: 2.5 },
                    }}
                  >
                    {/* Title */}
                    <Typography
                      onClick={() => handleNavigation(course._id)}
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.05rem",
                        color: COLORS.text,
                        lineHeight: 1.3,
                        mb: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "2.7em",
                        cursor: "pointer",
                        transition: "color 0.2s",
                        "&:hover": { color: COLORS.primary },
                      }}
                    >
                      {course.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                      sx={{
                        fontSize: "0.82rem",
                        color: COLORS.textMuted,
                        lineHeight: 1.55,
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {course.description || "No description available."}
                    </Typography>

                    {/* Meta info row */}
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
                    >
                      {course.language && (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Language sx={{ fontSize: 14, color: COLORS.textMuted }} />
                          <Typography
                            sx={{ fontSize: "0.75rem", color: COLORS.textMuted, fontWeight: 500 }}
                          >
                            {course.language}
                          </Typography>
                        </Stack>
                      )}
                      {course.analytics?.enrollments > 0 && (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <PeopleAlt sx={{ fontSize: 14, color: COLORS.textMuted }} />
                          <Typography
                            sx={{ fontSize: "0.75rem", color: COLORS.textMuted, fontWeight: 500 }}
                          >
                            {course.analytics.enrollments}
                          </Typography>
                        </Stack>
                      )}
                      {course.analytics?.averageRating > 0 && (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Star sx={{ fontSize: 14, color: "#fbbf24" }} />
                          <Typography
                            sx={{ fontSize: "0.75rem", color: COLORS.text, fontWeight: 600 }}
                          >
                            {course.analytics.averageRating.toFixed(1)}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>

                    {/* Progress bar (demo) */}
                    <Box sx={{ mb: 2.5 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 0.8 }}
                      >
                        <Typography
                          sx={{ fontSize: "0.72rem", color: COLORS.textMuted, fontWeight: 600 }}
                        >
                          Progress
                        </Typography>
                        <Typography
                          sx={{ fontSize: "0.72rem", color: COLORS.primary, fontWeight: 700 }}
                        >
                          {course.progress || 0}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={course.progress || 0}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "#e2e8f0",
                          "& .MuiLinearProgress-bar": {
                            background: COLORS.gradient,
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Box>

                    {/* Action Buttons */}
                    <Stack spacing={1} sx={{ mt: "auto" }}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<PlayCircleOutline />}
                        onClick={() => handleNavigation(course._id)}
                        sx={{
                          background: COLORS.gradient,
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          borderRadius: "10px",
                          py: 1.1,
                          boxShadow: `0 4px 12px ${COLORS.shadow}`,
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
                            boxShadow: `0 6px 16px ${COLORS.shadow}`,
                          },
                        }}
                      >
                        {course.progress > 0 ? "Continue Learning" : "Start Learning"}
                      </Button>

                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Quiz />}
                        onClick={() => handleQuiz(course._id)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          borderColor: "#cbd5e1",
                          color: COLORS.textMuted,
                          borderRadius: "10px",
                          py: 1,
                          "&:hover": {
                            borderColor: COLORS.primary,
                            color: COLORS.primary,
                            background: "rgba(79,70,229,0.04)",
                          },
                        }}
                      >
                        Take Quiz
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* ═══ Bottom Explore CTA ═══ */}
        {profile?.enrolledCourses?.length > 0 && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            sx={{ textAlign: "center", mt: { xs: 5, md: 8 } }}
          >
            <Typography sx={{ color: COLORS.textMuted, fontSize: "0.95rem", mb: 2 }}>
              Want to learn something new?
            </Typography>
            <Button
              variant="outlined"
              endIcon={<ArrowForward />}
              onClick={() => navigate("/user/course")}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.95rem",
                borderColor: COLORS.primary,
                color: COLORS.primary,
                borderRadius: "12px",
                px: 4,
                py: 1.3,
                borderWidth: 1.5,
                "&:hover": {
                  borderWidth: 1.5,
                  borderColor: COLORS.primaryDark,
                  background: "rgba(79,70,229,0.04)",
                },
              }}
            >
              Explore More Courses
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default UserCourse;
