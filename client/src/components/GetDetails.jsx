import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Button,
  Rating,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
  Skeleton,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  ArrowBack,
  PlayCircleOutline,
  FavoriteBorder,
  Favorite,
  Share,
  PeopleAlt,
  Star,
  Language,
  WorkspacePremium,
  AccessTime,
  CheckCircle,
  Lock,
  School,
  VerifiedUser,
  ExpandMore,
  LocalOffer,
  PlayArrow,
  MenuBook,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ─── Theme Tokens ───
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

const GetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  const userId = localStorage.getItem("userid");
  const isEnrolled = course?.enrolledUsers?.includes(userId);

  // ─── Fetch Course ───
  const getCourseDetails = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/courses/detail/${id}`);
      setCourse(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCourseDetails();
  }, [id]);

  // ─── Image URL helper ───
  const getImageUrl = (thumb) => {
    if (!thumb) return "";
    return `${API_BASE}/${thumb.replace(/\\/g, "/")}`;
  };

  // ─── Enroll ───
  const enrollInCourse = async (course) => {
    if (isEnrolled) {
      navigate(`/user/lect/${course._id}`);
      return;
    }

    setEnrolling(true);
    try {
      const response = await apiClient.post(`/courses/${course._id}/enroll`);
      const orderData = response.data;

      if (course.coursePrice > 0) {
        const options = {
          key: "rzp_test_pVQpC22qnKIhBQ",
          amount: orderData.coursePrice * 100,
          currency: "INR",
          name: orderData.name || course.title,
          description: `Purchase ${orderData.name}`,
          order_id: orderData.orderId,
          handler: async (response) => {
            try {
              const verifyRes = await apiClient.post(`/courses/verify-payment`, {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                courseId: orderData.courseId,
              });
              toast.success(verifyRes.data.message || "Payment successful!");
              navigate(`/user/lect/${course._id}`);
            } catch (err) {
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
    } catch (error) {
      if (error.response?.status === 400) {
        toast.info("Already enrolled — redirecting...");
        navigate(`/user/lect/${course._id}`);
      } else {
        toast.error("Enrollment failed.");
      }
    } finally {
      setEnrolling(false);
    }
  };

  // ─── Wishlist ───
  const handleWishlist = async () => {
    try {
      const res = await apiClient.post(
        `/courses/${id}/wishlist`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (res.data.message === "Added to wishlist") {
        setWishlisted(true);
        toast.success("Added to wishlist!");
      } else {
        setWishlisted(false);
        toast.success("Removed from wishlist!");
      }
    } catch (err) {
      toast.error("Wishlist update failed.");
    }
  };

  // ─── Share ───
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: course.title,
          text: course.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied!");
      }
    } catch (err) {
      // user cancelled
    }
  };

  // ═══════════ LOADING ═══════════
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
          py: { xs: 4, md: 6 },
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 } }}>
          <Skeleton variant="rounded" height={50} width={120} sx={{ mb: 3 }} />
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Skeleton variant="rounded" height={400} sx={{ borderRadius: "24px", mb: 3 }} />
              <Skeleton variant="rounded" height={200} sx={{ borderRadius: "16px" }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rounded" height={450} sx={{ borderRadius: "20px" }} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }

  // ═══════════ ERROR ═══════════
  if (error) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
          p: 3,
        }}
      >
        <Card sx={{ p: 4, borderRadius: "20px", textAlign: "center", maxWidth: 500 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: COLORS.text }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/user/course")}
            sx={{
              mt: 2,
              background: COLORS.gradient,
              textTransform: "none",
              borderRadius: "10px",
              fontWeight: 700,
            }}
          >
            Back to Courses
          </Button>
        </Card>
      </Box>
    );
  }

  if (!course) return null;

  const totalPrice = course.coursePrice + (course.discount || 0);
  const discountPct =
    course.discount > 0 ? Math.round((course.discount / totalPrice) * 100) : 0;

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

      <Box
        sx={{
          maxWidth: 1300,
          mx: "auto",
          px: { xs: 2, md: 4 },
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Back */}
        <Button
          component={motion.button}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            textTransform: "none",
            color: COLORS.textMuted,
            fontWeight: 600,
            mb: 3,
            px: 1.5,
            "&:hover": { background: "rgba(79,70,229,0.06)", color: COLORS.primary },
          }}
        >
          Back
        </Button>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* ═══════════ LEFT COLUMN ═══════════ */}
          <Grid item xs={12} md={8}>
            {/* Hero Card */}
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              sx={{
                borderRadius: "24px",
                overflow: "hidden",
                mb: 3,
                boxShadow: "0 20px 60px rgba(15, 23, 42, 0.12)",
              }}
            >
              <Box sx={{ position: "relative", height: { xs: 240, sm: 340, md: 420 } }}>
                <CardMedia
                  component="img"
                  image={getImageUrl(course.courseThumbnail)}
                  alt={course.title}
                  sx={{ height: "100%", width: "100%", objectFit: "cover" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.2) 60%, transparent 100%)",
                  }}
                />

                {/* Actions */}
                <Stack direction="row" spacing={1} sx={{ position: "absolute", top: 16, right: 16 }}>
                  <Tooltip title="Wishlist">
                    <IconButton
                      onClick={handleWishlist}
                      sx={{
                        background: "rgba(255,255,255,0.92)",
                        backdropFilter: "blur(10px)",
                        "&:hover": { background: "#fff" },
                      }}
                    >
                      {wishlisted ? (
                        <Favorite sx={{ color: "#e11d48" }} />
                      ) : (
                        <FavoriteBorder sx={{ color: COLORS.textMuted }} />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share">
                    <IconButton
                      onClick={handleShare}
                      sx={{
                        background: "rgba(255,255,255,0.92)",
                        backdropFilter: "blur(10px)",
                        "&:hover": { background: "#fff" },
                      }}
                    >
                      <Share sx={{ color: COLORS.textMuted }} />
                    </IconButton>
                  </Tooltip>
                </Stack>

                {/* Play overlay */}
              <Box
  onClick={() => {
    if (isEnrolled) {
      // ✅ Enrolled → direct lecture page
      navigate(`/user/lect/${course._id}`);
    } else {
      // ❌ Not enrolled → enroll karo ya prompt
      toast.info("Please enroll to access lectures", {
        position: "top-center",
        autoClose: 2000,
      });
      enrollInCourse(course); // ya scroll to enroll card
    }
  }}
  sx={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.95)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",         // ✅ Clickable indication
    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
    transition: "transform 0.3s",
    "&:hover": { transform: "translate(-50%, -50%) scale(1.1)" },
  }}
>
  <PlayArrow sx={{ fontSize: 40, color: COLORS.primary }} />
</Box>

                {/* Category chips */}
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ position: "absolute", bottom: 16, left: 16 }}
                >
                  <Chip
                    label={course.category || "Course"}
                    size="small"
                    sx={{
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "0.72rem",
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  />
                  <Chip
                    icon={<WorkspacePremium sx={{ fontSize: "14px !important", color: "#fff !important" }} />}
                    label={course.courseLevel || "All Levels"}
                    size="small"
                    sx={{
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "0.72rem",
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  />
                </Stack>
              </Box>

              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography
                  component={motion.h1}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "1.6rem", md: "2.2rem" },
                    lineHeight: 1.2,
                    letterSpacing: "-1px",
                    color: COLORS.text,
                    mb: 2,
                  }}
                >
                  {course.title}
                </Typography>

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ mb: 3 }}
                >
                  <Stack direction="row" alignItems="center" spacing={0.8}>
                    <Rating
                      value={course.analytics?.averageRating || 0}
                      precision={0.1}
                      readOnly
                      size="small"
                      sx={{ "& .MuiRating-iconFilled": { color: "#fbbf24" } }}
                    />
                    <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: COLORS.text }}>
                      {(course.analytics?.averageRating || 0).toFixed(1)}
                    </Typography>
                  </Stack>
                  <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
                  <Stack direction="row" alignItems="center" spacing={0.8}>
                    <PeopleAlt sx={{ fontSize: 18, color: COLORS.textMuted }} />
                    <Typography sx={{ fontSize: "0.85rem", color: COLORS.textMuted, fontWeight: 500 }}>
                      {course.analytics?.enrollments || 0} students
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.8}>
                    <Language sx={{ fontSize: 18, color: COLORS.textMuted }} />
                    <Typography sx={{ fontSize: "0.85rem", color: COLORS.textMuted, fontWeight: 500 }}>
                      {course.language || "English"}
                    </Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ mb: 3 }} />

                <Typography
                  sx={{
                    fontSize: "1rem",
                    color: COLORS.textMuted,
                    lineHeight: 1.75,
                    mb: 3,
                  }}
                >
                  {course.description}
                </Typography>
              </CardContent>
            </Card>

            {/* What You'll Learn */}
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              sx={{
                borderRadius: "20px",
                p: { xs: 3, md: 4 },
                mb: 3,
                background: "#fff",
                boxShadow: "0 4px 20px rgba(15, 23, 42, 0.06)",
                border: "1px solid rgba(226, 232, 240, 0.8)",
              }}
            >
              <Typography sx={{ fontWeight: 800, fontSize: "1.3rem", color: COLORS.text, mb: 2.5 }}>
                What you'll learn
              </Typography>
              <Grid container spacing={2}>
                {[
                  "Master core concepts from scratch",
                  "Build real-world projects",
                  "Learn industry best practices",
                  "Lifetime access to content",
                  "Certificate of completion",
                  "Community of fellow learners",
                ].map((item, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                      <CheckCircle sx={{ color: "#10b981", fontSize: 22, mt: 0.1, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: "0.9rem", color: COLORS.text, lineHeight: 1.5 }}>
                        {item}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Card>

            {/* Prerequisites */}
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              sx={{
                borderRadius: "20px",
                p: { xs: 3, md: 4 },
                mb: 3,
                background: "#fff",
                boxShadow: "0 4px 20px rgba(15, 23, 42, 0.06)",
                border: "1px solid rgba(226, 232, 240, 0.8)",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    background: "rgba(79, 70, 229, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MenuBook sx={{ color: COLORS.primary, fontSize: 22 }} />
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: "1.3rem", color: COLORS.text }}>
                  Prerequisites
                </Typography>
              </Stack>

              {course.prerequisites?.length > 0 ? (
                <Stack spacing={1.2}>
                  {course.prerequisites.map((prerequisite, index) => (
                    <Stack
                      key={index}
                      direction="row"
                      alignItems="flex-start"
                      spacing={1.5}
                      sx={{
                        p: 1.5,
                        borderRadius: "10px",
                        background: "#f8fafc",
                        transition: "all 0.2s",
                        "&:hover": { background: "#eef2ff" },
                      }}
                    >
                      <CheckCircle sx={{ color: COLORS.primary, fontSize: 18, mt: 0.2 }} />
                      <Typography sx={{ fontSize: "0.9rem", color: COLORS.text }}>
                        {prerequisite}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 3,
                    px: 2,
                    borderRadius: "10px",
                    background: "#f8fafc",
                  }}
                >
                  <Typography sx={{ fontSize: "0.9rem", color: COLORS.textMuted }}>
                    No prerequisites needed — open to everyone
                  </Typography>
                </Box>
              )}
            </Card>

            {/* Reviews */}
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              sx={{
                borderRadius: "20px",
                p: { xs: 3, md: 4 },
                background: "#fff",
                boxShadow: "0 4px 20px rgba(15, 23, 42, 0.06)",
                border: "1px solid rgba(226, 232, 240, 0.8)",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2.5 }}
              >
                <Typography sx={{ fontWeight: 800, fontSize: "1.3rem", color: COLORS.text }}>
                  Student Reviews
                </Typography>
                <Chip
                  icon={<Star sx={{ fontSize: "14px !important", color: "#fbbf24 !important" }} />}
                  label={`${(course.analytics?.averageRating || 0).toFixed(1)} avg`}
                  size="small"
                  sx={{
                    background: "#fef3c7",
                    color: "#92400e",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                  }}
                />
              </Stack>

              {course.reviews?.length > 0 ? (
                <Stack spacing={2.5} divider={<Divider />}>
                  {course.reviews.map((review, index) => (
                    <Box key={index}>
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            background: COLORS.gradient,
                            fontSize: "0.9rem",
                            fontWeight: 700,
                          }}
                        >
                          {review.user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" alignItems="center" spacing={0.6}>
                            <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: COLORS.text }}>
                              {review.user?.name || "Anonymous"}
                            </Typography>
                            <VerifiedUser sx={{ fontSize: 14, color: COLORS.primary }} />
                          </Stack>
                          <Rating
                            value={review.rating}
                            precision={0.5}
                            readOnly
                            size="small"
                            sx={{ "& .MuiRating-iconFilled": { color: "#fbbf24" } }}
                          />
                        </Box>
                      </Stack>
                      <Typography
                        sx={{
                          fontSize: "0.9rem",
                          color: COLORS.textMuted,
                          lineHeight: 1.65,
                          pl: 6.5,
                        }}
                      >
                        {review.comment}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 5,
                    px: 2,
                    borderRadius: "12px",
                    background: "#f8fafc",
                  }}
                >
                  <Star sx={{ fontSize: 36, color: "#cbd5e1", mb: 1 }} />
                  <Typography sx={{ fontSize: "0.9rem", color: COLORS.textMuted }}>
                    No reviews yet — be the first to review!
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>

          {/* ═══════════ RIGHT COLUMN — Sticky Enroll Card ═══════════ */}
          <Grid item xs={12} md={4}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              sx={{
                position: { md: "sticky" },
                top: { md: 24 },
                borderRadius: "20px",
                p: 3,
                background: "#fff",
                boxShadow: "0 20px 50px rgba(15, 23, 42, 0.12)",
                border: "1px solid rgba(226, 232, 240, 0.8)",
              }}
            >
              {/* Price */}
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  {course.coursePrice > 0 ? (
                    <>
                      <Typography
                        sx={{ fontWeight: 800, fontSize: "2rem", color: COLORS.text, lineHeight: 1 }}
                      >
                        ₹{course.coursePrice}
                      </Typography>
                      {course.discount > 0 && (
                        <Stack alignItems="flex-start">
                          <Typography
                            sx={{
                              fontSize: "0.9rem",
                              color: COLORS.textMuted,
                              textDecoration: "line-through",
                            }}
                          >
                            ₹{totalPrice}
                          </Typography>
                          <Chip
                            icon={<LocalOffer sx={{ fontSize: "14px !important" }} />}
                            label={`${discountPct}% OFF`}
                            size="small"
                            sx={{
                              background: "#fee2e2",
                              color: "#dc2626",
                              fontWeight: 700,
                              fontSize: "0.7rem",
                              height: 22,
                            }}
                          />
                        </Stack>
                      )}
                    </>
                  ) : (
                    <Typography
                      sx={{ fontWeight: 800, fontSize: "1.8rem", color: "#10b981", lineHeight: 1 }}
                    >
                      Free
                    </Typography>
                  )}
                </Stack>
              </Box>

              {/* Enroll CTA */}
              <Button
                fullWidth
                variant="contained"
                startIcon={isEnrolled ? <PlayCircleOutline /> : null}
                onClick={() => enrollInCourse(course)}
                disabled={enrolling}
                sx={{
                  background: COLORS.gradient,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "1rem",
                  py: 1.5,
                  borderRadius: "12px",
                  mb: 1.5,
                  boxShadow: `0 8px 24px ${COLORS.shadow}`,
                  "&:hover": {
                    background: "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
                    boxShadow: `0 12px 32px ${COLORS.shadow}`,
                  },
                  "&:disabled": { opacity: 0.6 },
                }}
              >
                {enrolling
                  ? "Processing..."
                  : isEnrolled
                  ? "Continue Learning"
                  : course.coursePrice > 0
                  ? "Enroll Now"
                  : "Enroll Free"}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<FavoriteBorder />}
                onClick={handleWishlist}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: "#cbd5e1",
                  color: COLORS.text,
                  borderRadius: "12px",
                  py: 1.2,
                  mb: 3,
                  "&:hover": {
                    borderColor: COLORS.primary,
                    color: COLORS.primary,
                    background: "rgba(79,70,229,0.04)",
                  },
                }}
              >
                Add to Wishlist
              </Button>

              <Typography
                sx={{ fontSize: "0.78rem", color: COLORS.textMuted, textAlign: "center", mb: 2.5 }}
              >
                30-day money-back guarantee
              </Typography>

              <Divider sx={{ mb: 2.5 }} />

              <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: COLORS.text, mb: 1.5 }}>
                This course includes
              </Typography>
              <Stack spacing={1.5}>
                {[
                  { icon: <AccessTime />, text: "Lifetime access" },
                  { icon: <PlayCircleOutline />, text: "On-demand video" },
                  { icon: <School />, text: "Certificate of completion" },
                  { icon: <PeopleAlt />, text: "Community access" },
                ].map((item, i) => (
                  <Stack key={i} direction="row" alignItems="center" spacing={1.2}>
                    <Box sx={{ color: COLORS.primary, display: "flex", "& svg": { fontSize: 18 } }}>
                      {item.icon}
                    </Box>
                    <Typography sx={{ fontSize: "0.82rem", color: COLORS.textMuted, fontWeight: 500 }}>
                      {item.text}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default GetDetails;
