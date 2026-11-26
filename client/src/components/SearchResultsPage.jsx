import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Grid,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Container,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Avatar,
  IconButton,
  Skeleton,
  TextField,
  InputAdornment,
  Tooltip,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Search,
  ArrowBack,
  FavoriteBorder,
  Favorite,
  PeopleAlt,
  Star,
  Language,
  WorkspacePremium,
  PlayCircleOutline,
  InfoOutlined,
  Sort,
  FilterList,
  Explore,
  TrendingUp,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

// ─── Theme Tokens (matches whole LMS) ───
const COLORS = {
  primary: "#4f46e5",
  primaryDark: "#4338ca",
  accent: "#8b5cf6",
  text: "#0f172a",
  textMuted: "#64748b",
  gradient: "linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)",
  shadow: "rgba(79, 70, 229, 0.25)",
  success: "#10b981",
};

const API_BASE = "https://lmsb-apt8.onrender.com";

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, courses, error } = useSelector((state) => state.search);

  const [searchInput, setSearchInput] = useState("");
  const [wishlist, setWishlist] = useState({});
  const [sortBy, setSortBy] = useState("relevance");

  const queryParams = new URLSearchParams(location.search);
  const searchTermFromURL = queryParams.get("term") || "";

  useEffect(() => {
    setSearchInput(searchTermFromURL);
  }, [searchTermFromURL]);

  // ─── Image helper ───
  const getImageUrl = (thumb) => {
    if (!thumb) return "";
    return `${API_BASE}/${thumb.replace(/\\/g, "/")}`;
  };

  // ─── Enroll ───
  const enrollInCourse = async (course) => {
    try {
      const response = await apiClient.post(`/courses/${course._id}/enroll`);
      const orderData = response.data;

      if (course.coursePrice > 0) {
        const options = {
          key: "rzp_test_pVQpC22qnKIhBQ",
          amount: orderData.coursePrice * 100,
          currency: "INR",
          name: orderData.name || course.title,
          description: `Purchase ${orderData.name || course.title}`,
          order_id: orderData.orderId,
          handler: async (rzpResponse) => {
            try {
              const verifyRes = await apiClient.post(`/courses/verify-payment`, {
                paymentId: rzpResponse.razorpay_payment_id,
                orderId: rzpResponse.razorpay_order_id,
                signature: rzpResponse.razorpay_signature,
                courseId: orderData.courseId,
              });
              toast.success(verifyRes.data.message || "Payment successful!");
              navigate(`/user/lect/${course._id}`);
            } catch (err) {
              console.error("Payment Verification Failed:", err);
              toast.error("Payment verification failed.");
            }
          },
          prefill: {
            name: "Test User",
            email: "test@example.com",
            contact: "9999999999",
          },
          theme: { color: COLORS.primary },
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        toast.success(`Enrolled in "${course.title}"!`);
        navigate(`/user/lect/${course._id}`);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        toast.info(err.response.data.message || "Already enrolled");
        navigate(`/user/lect/${course._id}`);
      } else {
        toast.error("Enrollment failed.");
      }
    }
  };

  // ─── Wishlist ───
  const addToWishlist = async (courseId) => {
    try {
      const res = await apiClient.post(
        `/courses/${courseId}/wishlist`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const added = res.data.message === "Added to wishlist";
      setWishlist((prev) => ({ ...prev, [courseId]: added }));
      toast.success(added ? "Added to wishlist!" : "Removed from wishlist!");
    } catch (err) {
      toast.error("Wishlist update failed.");
    }
  };

  // ─── Sort ───
  const sortedCourses = [...(courses || [])].sort((a, b) => {
    if (sortBy === "priceLow") return (a.coursePrice || 0) - (b.coursePrice || 0);
    if (sortBy === "priceHigh") return (b.coursePrice || 0) - (a.coursePrice || 0);
    if (sortBy === "rating")
      return (b.analytics?.averageRating || 0) - (a.analytics?.averageRating || 0);
    if (sortBy === "popular")
      return (b.analytics?.enrollments || 0) - (a.analytics?.enrollments || 0);
    return 0; // relevance (default)
  });

  // ─── Search again ───
  const handleNewSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      toast.warn("Enter a search term");
      return;
    }
    navigate(`/user/search?term=${encodeURIComponent(searchInput)}`);
  };

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

        {/* ═══ Header ═══ */}
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
              <Avatar sx={{ background: "rgba(255,255,255,0.2)", width: 44, height: 44 }}>
                <Search />
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
                  Search Results
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.2rem", md: "1.5rem" } }}>
                  "{searchTermFromURL}"
                </Typography>
              </Box>
            </Stack>

            <Typography sx={{ fontSize: "0.9rem", opacity: 0.9, mb: 2.5 }}>
              {loading
                ? "Searching..."
                : `Found ${courses?.length || 0} course${courses?.length === 1 ? "" : "s"} matching your search`}
            </Typography>

            {/* New search bar */}
            <Box
              component="form"
              onSubmit={handleNewSearch}
              sx={{ display: "flex", gap: 1, flexDirection: { xs: "column", sm: "row" } }}
            >
              <TextField
                fullWidth
                placeholder="Search again..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                size="small"
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
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: "#fff",
                  color: COLORS.primary,
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: "10px",
                  px: 3,
                  py: 1,
                  whiteSpace: "nowrap",
                  "&:hover": { background: "#f1f5f9" },
                }}
              >
                Search
              </Button>
            </Box>
          </Box>
        </Card>

        {/* ═══ Loading ═══ */}
        {loading && (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={12} sm={6} lg={4} key={i}>
                <Skeleton variant="rounded" height={380} sx={{ borderRadius: "20px" }} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* ═══ Error ═══ */}
        {error && !loading && (
          <Alert severity="error" sx={{ borderRadius: "12px", maxWidth: 700, mx: "auto" }}>
            {error}
          </Alert>
        )}

        {/* ═══ Empty state ═══ */}
        {!loading && !error && courses?.length === 0 && (
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
              <Search sx={{ fontSize: 48, color: COLORS.primary }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: "1.4rem", color: COLORS.text, mb: 1 }}>
              No courses found
            </Typography>
            <Typography sx={{ color: COLORS.textMuted, fontSize: "0.95rem", mb: 4, maxWidth: 400, mx: "auto" }}>
              We couldn't find any courses matching "{searchTermFromURL}". Try a different search term or browse all courses.
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
                "&:hover": { background: "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)" },
              }}
            >
              Browse All Courses
            </Button>
          </Card>
        )}

        {/* ═══ Results toolbar ═══ */}
        {!loading && !error && courses?.length > 0 && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: COLORS.text }}>
                {courses.length} Result{courses.length === 1 ? "" : "s"}
              </Typography>
              <Typography sx={{ fontSize: "0.85rem", color: COLORS.textMuted }}>
                Matching "{searchTermFromURL}"
              </Typography>
            </Box>

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
                startAdornment={<Sort sx={{ color: COLORS.primary, mr: 0.5, ml: 1, fontSize: 18 }} />}
                sx={{
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
                }}
              >
                <MenuItem value="relevance">Relevance</MenuItem>
                <MenuItem value="rating">Top Rated</MenuItem>
                <MenuItem value="popular">Most Popular</MenuItem>
                <MenuItem value="priceLow">Price: Low to High</MenuItem>
                <MenuItem value="priceHigh">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        )}

        {/* ═══ Results grid ═══ */}
        {!loading && !error && sortedCourses.length > 0 && (
          <Grid container spacing={3}>
            {sortedCourses.map((course, index) => {
              const isWishlisted = wishlist[course._id];
              return (
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

                      {/* Wishlist icon */}
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          addToWishlist(course._id);
                        }}
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          background: "rgba(255,255,255,0.92)",
                          backdropFilter: "blur(8px)",
                          width: 36,
                          height: 36,
                          "&:hover": { background: "#fff" },
                        }}
                      >
                        {isWishlisted ? (
                          <Favorite sx={{ color: "#e11d48", fontSize: 18 }} />
                        ) : (
                          <FavoriteBorder sx={{ color: COLORS.textMuted, fontSize: 18 }} />
                        )}
                      </IconButton>

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

                      {/* Instructor */}
                      {course.instructor && (
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ mb: 2 }}
                        >
                          <Avatar
                            sx={{
                              width: 26,
                              height: 26,
                              background: COLORS.gradient,
                              fontSize: "0.7rem",
                              fontWeight: 700,
                            }}
                          >
                            {(
                              course.instructor?.name ||
                              course.instructor ||
                              "I"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </Avatar>
                          <Typography
                            sx={{ fontSize: "0.78rem", color: COLORS.textMuted, fontWeight: 500 }}
                          >
                            {course.instructor?.name || course.instructor}
                          </Typography>
                        </Stack>
                      )}

                      {/* Buttons */}
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
                          onClick={() => enrollInCourse(course)}
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
                          {course.coursePrice > 0 ? "Enroll" : "Free"}
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default SearchResultsPage;
