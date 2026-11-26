import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Avatar,
  Chip,
  Stack,
  Grid,
  IconButton,
  InputAdornment,
  Skeleton,
} from "@mui/material";
import { Box } from "@mui/system";
import {
  Person,
  Email,
  VerifiedUser,
  CalendarMonth,
  Lock,
  Visibility,
  VisibilityOff,
  School,
  PlayCircleOutline,
  WorkspacePremium,
  Language,
  CurrencyRupee,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ─── Theme Tokens (matches rest of LMS) ───
const COLORS = {
  primary: "#4f46e5",
  primaryDark: "#4338ca",
  accent: "#8b5cf6",
  text: "#0f172a",
  textMuted: "#64748b",
  gradient: "linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)",
  shadow: "rgba(79, 70, 229, 0.25)",
};

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [changeError, setChangeError] = useState(null);
  const [changeLoading, setChangeLoading] = useState(false);

  // ─── Fetch Profile ───
  async function fetchProfile() {
    try {
      const response = await fetch("https://lmsb-apt8.onrender.com/api/auth/profile", {
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
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  // ─── Change Password ───
  const handleChangePassword = async () => {
    setChangeError(null);

    if (!oldPassword || !newPassword) {
      setChangeError("Please fill in both fields.");
      return;
    }
    if (newPassword.length < 6) {
      setChangeError("New password must be at least 6 characters.");
      return;
    }

    setChangeLoading(true);
    try {
      const response = await fetch("https://lmsb-apt8.onrender.com/api/auth/change-password", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      toast.success("Password changed successfully!");
      setModalOpen(false);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setChangeError(err.message);
    } finally {
      setChangeLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setOldPassword("");
    setNewPassword("");
    setChangeError(null);
  };

  // ─── Loading ───
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
        <Box sx={{ maxWidth: 1000, mx: "auto" }}>
          <Skeleton variant="rounded" height={180} sx={{ borderRadius: "24px", mb: 3 }} />
          <Grid container spacing={3}>
            {[1, 2, 3].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rounded" height={280} sx={{ borderRadius: "16px" }} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    );
  }

  // ─── Error ───
  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
          p: 2,
        }}
      >
        <Alert severity="error" sx={{ borderRadius: "12px", maxWidth: 500 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #faf5ff 100%)",
        py: { xs: 4, md: 6 },
        px: { xs: 2, md: 4 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ToastContainer position="top-right" autoClose={2000} />

      {/* ─── Background Orbs ─── */}
      <Box
        component={motion.div}
        animate={{ x: [0, 30, -30, 0], y: [0, -30, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: { xs: 220, md: 380 },
          height: { xs: 220, md: 380 },
          background:
            "radial-gradient(circle, rgba(79,70,229,0.2) 0%, rgba(79,70,229,0) 70%)",
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
          width: { xs: 260, md: 420 },
          height: { xs: 260, md: 420 },
          background:
            "radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(139,92,246,0) 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <Box sx={{ maxWidth: 1100, mx: "auto", position: "relative", zIndex: 2 }}>
        {/* ═══════════ PROFILE HERO CARD ═══════════ */}
        <Card
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{
            borderRadius: "24px",
            overflow: "hidden",
            mb: 4,
            boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
          }}
        >
          {/* Gradient banner */}
          <Box
            sx={{
              height: { xs: 100, md: 140 },
              background: COLORS.gradient,
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.25) 0%, transparent 50%)",
              },
            }}
          />

          {/* Profile info */}
          <Box sx={{ px: { xs: 3, md: 5 }, pb: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "center", sm: "flex-end" },
                gap: 3,
                mt: { xs: -6, sm: -7 },
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 96, md: 128 },
                  height: { xs: 96, md: 128 },
                  fontSize: { xs: "2rem", md: "2.8rem" },
                  fontWeight: 800,
                  background: COLORS.gradient,
                  border: "6px solid #fff",
                  boxShadow: `0 8px 24px ${COLORS.shadow}`,
                }}
              >
                {profile?.name?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>

              <Box
                sx={{
                  flex: 1,
                  textAlign: { xs: "center", sm: "left" },
                  mb: { xs: 1, sm: 1 },
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  justifyContent={{ xs: "center", sm: "flex-start" }}
                  sx={{ mb: 0.5 }}
                >
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: "1.4rem", md: "1.8rem" },
                      color: COLORS.text,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {profile?.name}
                  </Typography>
                  <VerifiedUser sx={{ color: COLORS.primary, fontSize: 22 }} />
                </Stack>
                <Typography
                  sx={{ fontSize: "0.9rem", color: COLORS.textMuted, mb: 1.5 }}
                >
                  {profile?.email}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent={{ xs: "center", sm: "flex-start" }}
                  flexWrap="wrap"
                  useFlexGap
                >
                  <Chip
                    icon={<WorkspacePremium sx={{ fontSize: "16px !important" }} />}
                    label={profile?.role?.toUpperCase() || "STUDENT"}
                    size="small"
                    sx={{
                      background: "rgba(79, 70, 229, 0.1)",
                      color: COLORS.primary,
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      border: "1px solid rgba(79, 70, 229, 0.2)",
                    }}
                  />
                  <Chip
                    icon={<CalendarMonth sx={{ fontSize: "16px !important" }} />}
                    label={`Joined ${new Date(profile?.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}`}
                    size="small"
                    sx={{
                      background: "#f1f5f9",
                      color: COLORS.textMuted,
                      fontWeight: 600,
                      fontSize: "0.7rem",
                    }}
                  />
                  <Chip
                    icon={<School sx={{ fontSize: "16px !important" }} />}
                    label={`${profile?.enrolledCourses?.length || 0} Courses`}
                    size="small"
                    sx={{
                      background: "#f1f5f9",
                      color: COLORS.textMuted,
                      fontWeight: 600,
                      fontSize: "0.7rem",
                    }}
                  />
                </Stack>
              </Box>

              <Button
                variant="outlined"
                startIcon={<Lock />}
                onClick={() => setModalOpen(true)}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: COLORS.primary,
                  color: COLORS.primary,
                  borderRadius: "10px",
                  px: 3,
                  py: 1.2,
                  mb: { xs: 1, sm: 1.5 },
                  whiteSpace: "nowrap",
                  "&:hover": {
                    borderColor: COLORS.primaryDark,
                    background: "rgba(79, 70, 229, 0.04)",
                  },
                }}
              >
                Change Password
              </Button>
            </Box>
          </Box>
        </Card>

        {/* ═══════════ ENROLLED COURSES ═══════════ */}
        <Box sx={{ mb: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2.5, px: 1 }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: "1.3rem", md: "1.6rem" },
                  fontWeight: 800,
                  color: COLORS.text,
                  letterSpacing: "-0.5px",
                }}
              >
                My Enrolled Courses
              </Typography>
              <Typography sx={{ fontSize: "0.85rem", color: COLORS.textMuted }}>
                Continue where you left off
              </Typography>
            </Box>
          </Stack>

          {profile?.enrolledCourses && profile.enrolledCourses.length > 0 ? (
            <Grid container spacing={3}>
              {profile.enrolledCourses.map((course, index) => (
                <Grid item xs={12} sm={6} md={4} key={course._id}>
                  <Card
                    component={motion.div}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    sx={{
                      borderRadius: "18px",
                      overflow: "hidden",
                      background: "#fff",
                      boxShadow: "0 4px 20px rgba(15, 23, 42, 0.06)",
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: `0 20px 40px ${COLORS.shadow}`,
                        "& .course-img": { transform: "scale(1.08)" },
                      },
                    }}
                  >
                    {/* Image */}
                    <Box
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        height: 160,
                      }}
                    >
                      <CardMedia
                        className="course-img"
                        component="img"
                        alt={course.title}
                        image={`https://lmsb-apt8.onrender.com/${course.courseThumbnail}`}
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
                            "linear-gradient(to top, rgba(15,23,42,0.7) 0%, transparent 60%)",
                        }}
                      />
                      <Chip
                        label={course.category || "Course"}
                        size="small"
                        sx={{
                          position: "absolute",
                          bottom: 10,
                          left: 10,
                          background: "rgba(255,255,255,0.25)",
                          backdropFilter: "blur(10px)",
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          border: "1px solid rgba(255,255,255,0.3)",
                        }}
                      />
                    </Box>

                    {/* Content */}
                    <CardContent
                      sx={{
                        p: 2.5,
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        "&:last-child": { pb: 2.5 },
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: COLORS.text,
                          lineHeight: 1.3,
                          mb: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: "2.6em",
                        }}
                      >
                        {course.title}
                      </Typography>

                      <Stack spacing={1} sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.8,
                          }}
                        >
                          <Language sx={{ fontSize: 16, color: COLORS.textMuted }} />
                          <Typography
                            sx={{ fontSize: "0.8rem", color: COLORS.textMuted }}
                          >
                            {course.language || "English"}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.8,
                          }}
                        >
                          <CurrencyRupee sx={{ fontSize: 16, color: COLORS.textMuted }} />
                          <Typography
                            sx={{
                              fontSize: "0.8rem",
                              color: COLORS.textMuted,
                              fontWeight: 600,
                            }}
                          >
                            {course.coursePrice > 0
                              ? `₹${course.coursePrice}`
                              : "Free"}
                          </Typography>
                        </Box>
                      </Stack>

                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<PlayCircleOutline />}
                        onClick={() => navigate(`/user/lect/${course._id}`)}
                        sx={{
                          mt: "auto",
                          background: COLORS.gradient,
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          borderRadius: "10px",
                          py: 1,
                          boxShadow: `0 4px 12px ${COLORS.shadow}`,
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
                          },
                        }}
                      >
                        Continue Learning
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              sx={{
                borderRadius: "20px",
                p: { xs: 4, md: 6 },
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(10px)",
                border: "1px dashed #cbd5e1",
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "rgba(79, 70, 229, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <School sx={{ fontSize: 40, color: COLORS.primary }} />
              </Box>
              <Typography
                sx={{ fontWeight: 700, fontSize: "1.1rem", color: COLORS.text, mb: 1 }}
              >
                No courses yet
              </Typography>
              <Typography
                sx={{ color: COLORS.textMuted, fontSize: "0.9rem", mb: 3 }}
              >
                You haven't enrolled in any courses. Start your learning journey today!
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/user/course")}
                sx={{
                  background: COLORS.gradient,
                  textTransform: "none",
                  fontWeight: 700,
                  px: 4,
                  py: 1.2,
                  borderRadius: "10px",
                  boxShadow: `0 8px 20px ${COLORS.shadow}`,
                  "&:hover": {
                    background: "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
                  },
                }}
              >
                Browse Courses
              </Button>
            </Card>
          )}
        </Box>
      </Box>

      {/* ═══════════ CHANGE PASSWORD DIALOG ═══════════ */}
      <Dialog
        open={modalOpen}
        onClose={closeModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "20px",
            p: 1,
            boxShadow: "0 25px 60px rgba(15, 23, 42, 0.25)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            fontSize: "1.3rem",
            color: COLORS.text,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            pb: 1,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              background: COLORS.gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lock sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          Change Password
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {changeError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
              {changeError}
            </Alert>
          )}

          <Typography
            sx={{ fontSize: "0.85rem", color: COLORS.textMuted, mb: 2.5 }}
          >
            Enter your current password and choose a new one.
          </Typography>

          <TextField
            label="Current Password"
            type={showOld ? "text" : "password"}
            fullWidth
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            margin="dense"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowOld(!showOld)}
                    edge="end"
                    size="small"
                  >
                    {showOld ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#f8fafc",
              },
            }}
          />

          <TextField
            label="New Password"
            type={showNew ? "text" : "password"}
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="dense"
            helperText="Minimum 6 characters"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNew(!showNew)}
                    edge="end"
                    size="small"
                  >
                    {showNew ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#f8fafc",
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
          <Button
            onClick={closeModal}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: COLORS.textMuted,
              borderRadius: "10px",
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleChangePassword}
            disabled={changeLoading}
            sx={{
              background: COLORS.gradient,
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "10px",
              px: 4,
              py: 1,
              boxShadow: `0 8px 20px ${COLORS.shadow}`,
              "&:hover": {
                background: "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
              },
              "&:disabled": { opacity: 0.6 },
            }}
          >
            {changeLoading ? "Updating..." : "Update Password"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
