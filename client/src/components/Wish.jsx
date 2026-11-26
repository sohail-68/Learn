import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Grid,
  Avatar,
  Box,
  Container,
  Chip,
  Stack,
  IconButton,
  Skeleton,
  Alert,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  ArrowBack,
  Search,
  Explore,
  PlayCircleOutline,
  InfoOutlined,
  PeopleAlt,
  Star,
  Language,
  DeleteOutline,
  Sort,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://lmsb-apt8.onrender.com";

// ─── Theme Tokens ───
const COLORS = {
  primary: "#4f46e5",
  primaryDark: "#4338ca",
  accent: "#8b5cf6",
  text: "#0f172a",
  textMuted: "#64748b",
  gradient: "linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)",
  shadow: "rgba(79, 70, 229, 0.25)",
  success: "#10b981",
  error: "#dc2626",
};

const Wish = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [removing, setRemoving] = useState({});
  const navigate = useNavigate();

  // ─── Fetch Wishlist ───
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/auth/getwish`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCourses(response.data.courses || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load wishlist. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  // ─── Image URL helper ───
  const getImageUrl = (thumb) => {
    if (!thumb) return "";
    return `${API_BASE}/${thumb.replace(/\\/g, "/")}`;
  };

  // ─── Remove from wishlist ───
  const handleRemove = async (courseId) => {
    setRemoving((prev) => ({ ...prev, [courseId]: true }));
    try {
      await axios.post(
        `${API_BASE}/api/courses/${courseId}/wishlist`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove from wishlist");
    } finally {
      setRemoving((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  // ─── Filter + sort ───
  const filteredCourses = courses
    .filter((course) =>
      course.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "priceLow") return (a.coursePrice || 0) - (b.coursePrice || 0);
      if (sortBy === "priceHigh") return (b.coursePrice || 0) - (a.coursePrice || 0);
      if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");
      return 0; // recent
    });

  // ═══════════ LOADING ═══════════
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Skeleton variant="rounded" height={140} sx={{ mb: 4, borderRadius: "20px" }} />
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={12} sm={6} lg={4} key={i}>
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
        py: { xs: 3, md: 5 },
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
          background: "radial-gradient(circle, rgba(79,70,229,0.18) 0%, rgba(79,70,229,0) 70%)",
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
          background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, rgba(139,92,246,0) 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        {/* ═══ Back button ═══ */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            textTransform: "none",
            color: COLORS.textMuted,
            fontWeight: 600,
            mb: 2,
            px: 1.5,
            "&:hover": { background: "rgba(79,70,229,0.06)", color: COLORS.primary },
          }}
        >
          Back
        </Button>

        {/* ═══ Header Card ═══ */}
        <Card
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            borderRadius: "20px",
            mb: 4,
            p: { xs: 3, md: 4 },
            background: COLORS.gradient,
            color: "#fff",
            boxShadow: `0 15px 40px ${COLORS.shadow}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "-50%",
              right: "-20%",
              width: 300,
              height: 300,
              background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
              <Avatar sx={{ background: "rgba(255,255,255,0.2)", width: 48, height: 48 }}>
                <Favorite />
              </Avatar>
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    opacity: 0.9,
                  }}
                >
                  My Wishlist
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.3rem", md: "1.7rem" } }}>
                  Saved for Later
                </Typography>
              </Box>
            </Stack>

            <Typography sx={{ fontSize: "0.9rem", opacity: 0.9, mb: 2.5 }}>
              {courses.length > 0
                ? `You have ${courses.length} course${courses.length === 1 ? "" : "s"} saved. Ready to start learning?`
                : "Courses you save will appear here. Start exploring and build your learning path!"}
            </Typography>

            {/* Search + Sort */}
            {courses.length > 0 && (
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ mt: 1 }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search your wishlist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: "#fff" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#fff",
                      borderRadius: "10px",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                      "&.Mui-focused fieldset": { borderColor: "#fff" },
                      "& input::placeholder": { color: "rgba(255,255,255,0.7)" },
                    },
                  }}
                />
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    startAdornment={
                      <Sort sx={{ color: "#fff", mr: 0.5, ml: 1, fontSize: 18 }} />
                    }
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#fff",
                      borderRadius: "10px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255,255,255,0.3)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255,255,255,0.5)",
                      },
                      "& .MuiSvgIcon-root": { color: "#fff" },
                    }}
                  >
                    <MenuItem value="recent" sx={{ color: COLORS.text }}>Recently Added</MenuItem>
                    <MenuItem value="title" sx={{ color: COLORS.text }}>Title A–Z</MenuItem>
                    <MenuItem value="priceLow" sx={{ color: COLORS.text }}>Price: Low to High</MenuItem>
                    <MenuItem value="priceHigh" sx={{ color: COLORS.text }}>Price: High to Low</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            )}
          </Box>
        </Card>

        {/* ═══ Error ═══ */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "12px", maxWidth: 700, mx: "auto" }}>
            {error}
          </Alert>
        )}

        {/* ═══ Empty state ═══ */}
        {!error && courses.length === 0 && (
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{
              p: { xs: 4, md: 8 },
              borderRadius: "24px",
              textAlign: "center",
              background: "rgba(255,255,255,0.85)",
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
              <FavoriteBorder sx={{ fontSize: 48, color: COLORS.primary }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: "1.4rem", color: COLORS.text, mb: 1 }}>
              Your wishlist is empty
            </Typography>
            <Typography sx={{ color: COLORS.textMuted, fontSize: "0.95rem", mb: 4, maxWidth: 400, mx: "auto" }}>
              Save courses you're interested in and come back to them later. Start building your learning path!
            </Typography>
            <Button
              variant="contained"
              startIcon={<Explore />}
              onClick={() => navigate("/user/course")}
              sx={{
                background: COLORS.gradient,
                textTransform: "none",
                fontWeight: 700,
                px: 4,
                py: 1.4,
                borderRadius: "12px",
                boxShadow: `0 8px 24px ${COLORS.shadow}`,
                "&:hover": {
                  background: "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
                },
              }}
            >
              Explore Courses
            </Button>
          </Card>
        )}

        {/* ═══ No search results ═══ */}
        {courses.length > 0 && filteredCourses.length === 0 && (
          <Card
            sx={{
              p: 5,
              borderRadius: "20px",
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

        {/* ═══ Wishlist Grid ═══ */}
        {filteredCourses.length > 0 && (
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {filteredCourses.map((course, index) => (
              <Grid item xs={12} sm={6} lg={4} key={course._id}>
                <Card
                  component={motion.div}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
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
                      "& .course-img": { transform: "scale(1.08)" },
                    },
                  }}
                >
                  {/* Image */}
                  <Box
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      height: 180,
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/user/detail/${course._id}`)}
                  >
                    <CardMedia
                      className="course-img"
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

                    {/* Price chip */}
                    <Chip
                      label={
                        course.coursePrice > 0 ? `₹${course.coursePrice}` : "FREE"
                      }
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        background:
                          course.coursePrice > 0 ? COLORS.gradient : COLORS.success,
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "0.72rem",
                        borderRadius: "8px",
                        height: 26,
                        px: 1,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                      }}
                    />

                    {/* Remove button */}
                    <Tooltip title="Remove from wishlist">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(course._id);
                        }}
                        disabled={removing[course._id]}
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          background: "rgba(255,255,255,0.92)",
                          backdropFilter: "blur(8px)",
                          width: 36,
                          height: 36,
                          "&:hover": { background: "#fee2e2" },
                          "&:hover .MuiSvgIcon-root": { color: COLORS.error },
                        }}
                      >
                        <DeleteOutline
                          sx={{ color: "#e11d48", fontSize: 20 }}
                        />
                      </IconButton>
                    </Tooltip>

                    {/* Category + level chips */}
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
                      onClick={() => navigate(`/user/detail/${course._id}`)}
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

                    {/* Meta row */}
                    <Stack
                      direction="row"
                      spacing={2}
                      flexWrap="wrap"
                      useFlexGap
                      sx={{ mb: 2 }}
                    >
                      {course.language && (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Language sx={{ fontSize: 14, color: COLORS.textMuted }} />
                          <Typography sx={{ fontSize: "0.75rem", color: COLORS.textMuted, fontWeight: 500 }}>
                            {course.language}
                          </Typography>
                        </Stack>
                      )}
                      {course.analytics?.enrollments > 0 && (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <PeopleAlt sx={{ fontSize: 14, color: COLORS.textMuted }} />
                          <Typography sx={{ fontSize: "0.75rem", color: COLORS.textMuted, fontWeight: 500 }}>
                            {course.analytics.enrollments}
                          </Typography>
                        </Stack>
                      )}
                      {course.analytics?.averageRating > 0 && (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Star sx={{ fontSize: 14, color: "#fbbf24" }} />
                          <Typography sx={{ fontSize: "0.75rem", color: COLORS.text, fontWeight: 600 }}>
                            {course.analytics.averageRating.toFixed(1)}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>

                    {/* Actions */}
                    <Stack direction="row" spacing={1} sx={{ mt: "auto" }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<InfoOutlined />}
                        onClick={() => navigate(`/user/detail/${course._id}`)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          fontSize: "0.8rem",
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
                        Details
                      </Button>
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<PlayCircleOutline />}
                        onClick={() => navigate(`/user/detail/${course._id}`)}
                        sx={{
                          background: COLORS.gradient,
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          borderRadius: "10px",
                          py: 1,
                          boxShadow: `0 4px 12px ${COLORS.shadow}`,
                          "&:hover": {
                            background: "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
                          },
                        }}
                      >
                        Enroll
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* ═══ Bottom explore CTA ═══ */}
        {filteredCourses.length > 0 && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            sx={{ textAlign: "center", mt: { xs: 5, md: 8 } }}
          >
            <Typography sx={{ color: COLORS.textMuted, fontSize: "0.95rem", mb: 2 }}>
              Looking for something else?
            </Typography>
            <Button
              variant="outlined"
              endIcon={<Explore />}
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

export default Wish;
