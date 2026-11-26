import React, { useEffect, useState } from "react";
import { getQuizzesByCourse, submitQuiz } from "../services/quizService";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container, Card, CardContent, Typography, Button, Grid, Box,
  LinearProgress, Chip, Stack, Avatar, Divider, Radio, Skeleton,
  Alert, Zoom,
} from "@mui/material";
import {
  EmojiEvents, SentimentDissatisfied, CheckCircle, ArrowBack,
  Quiz as QuizIcon, ArrowForward, PlayCircleOutline, HelpOutline,
  DoneAll, Lock,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const QuizPage = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [submittedQuizzes, setSubmittedQuizzes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState({});

  // ✅ FIX 1: Restore attempts from backend
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getQuizzesByCourse(courseId);
        const fetchedQuizzes = data.quizzes || [];

        const preSubmitted = {};
        fetchedQuizzes.forEach((quiz) => {
          if (quiz.hasAttempted && quiz.attempt) {
            preSubmitted[quiz._id] = {
              score: quiz.attempt.score,
              total: quiz.attempt.total,
              timestamp: quiz.attempt.submittedAt,
            };
          }
        });

        setQuizzes(fetchedQuizzes);
        setAnswers(
          fetchedQuizzes.map((quiz) =>
            new Array(quiz.questions.length).fill(null)
          )
        );
        setSubmittedQuizzes(preSubmitted);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [courseId]);

  const handleSelectAnswer = (quizIndex, questionIndex, selectedOption) => {
    const quizId = quizzes[quizIndex]._id;
    if (submittedQuizzes[quizId]) {
      toast.warning("You've already attempted this quiz.");
      return;
    }
    const newAnswers = [...answers];
    newAnswers[quizIndex] = [...newAnswers[quizIndex]];
    newAnswers[quizIndex][questionIndex] = selectedOption;
    setAnswers(newAnswers);
  };

  // ✅ FIX 2: Handle already-attempted error from backend
  const handleSubmit = async (quizId, quizIndex) => {
    if (submittedQuizzes[quizId] || submitting[quizId]) return;

    const quizAnswers = answers[quizIndex];
    const unanswered = quizAnswers.filter((a) => a === null).length;

    if (unanswered > 0) {
      const ok = window.confirm(
        `${unanswered} question${unanswered > 1 ? "s" : ""} unanswered. Submit anyway?`
      );
      if (!ok) return;
    }

    setSubmitting((prev) => ({ ...prev, [quizId]: true }));

    try {
      const response = await submitQuiz(quizId, quizAnswers);
      if (response.success) {
        setSubmittedQuizzes((prev) => ({
          ...prev,
          [quizId]: {
            score: response.score,
            total: quizzes[quizIndex].questions.length,
            timestamp: Date.now(),
          },
        }));
        toast.success(
          `Quiz submitted! Score: ${response.score}/${quizzes[quizIndex].questions.length}`
        );
      }
    } catch (err) {
      if (err.response?.data?.alreadyAttempted) {
        toast.error("You've already attempted this quiz.");
        setSubmittedQuizzes((prev) => ({
          ...prev,
          [quizId]: {
            score: err.response.data.attempt.score,
            total: err.response.data.attempt.total,
            timestamp: err.response.data.attempt.submittedAt,
          },
        }));
      } else {
        toast.error(err.response?.data?.message || "Failed to submit quiz.");
      }
    } finally {
      setSubmitting((prev) => ({ ...prev, [quizId]: false }));
    }
  };

  const totalQuizzes = quizzes.length;
  const totalQuestions = quizzes.reduce((a, q) => a + q.questions.length, 0);
  const submittedCount = Object.keys(submittedQuizzes).length;
  const totalScoreObtained = Object.values(submittedQuizzes).reduce(
    (a, s) => a + s.score, 0
  );
  const totalAttemptedQuestions = Object.values(submittedQuizzes).reduce(
    (a, s) => a + s.total, 0
  );
  const overallPercentage =
    totalAttemptedQuestions > 0
      ? Math.round((totalScoreObtained / totalAttemptedQuestions) * 100)
      : 0;
  const allSubmitted = submittedCount === totalQuizzes && totalQuizzes > 0;

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)", py: 6 }}>
        <Container maxWidth="lg">
          <Skeleton variant="rounded" height={140} sx={{ mb: 3, borderRadius: "20px" }} />
          {[1, 2].map((i) => (
            <Skeleton key={i} variant="rounded" height={340} sx={{ mb: 2, borderRadius: "20px" }} />
          ))}
        </Container>
      </Box>
    );
  }

  if (error || !quizzes.length) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)", p: 3 }}>
        <Card sx={{ p: 5, borderRadius: "24px", textAlign: "center", maxWidth: 500 }}>
          <Avatar sx={{ width: 80, height: 80, mx: "auto", mb: 2, background: "rgba(79, 70, 229, 0.1)" }}>
            <QuizIcon sx={{ fontSize: 40, color: COLORS.primary }} />
          </Avatar>
          <Typography sx={{ fontWeight: 800, fontSize: "1.3rem", mb: 1 }}>
            {error || "No Quizzes Available"}
          </Typography>
          <Typography sx={{ color: COLORS.textMuted, mb: 3, fontSize: "0.9rem" }}>
            {error ? "Please try again." : "This course doesn't have any quizzes yet."}
          </Typography>
          <Button startIcon={<ArrowBack />} onClick={() => navigate(`/user/lect/${courseId}`)} sx={{ background: COLORS.gradient, color: "#fff", fontWeight: 700, borderRadius: "10px", textTransform: "none", px: 3 }}>
            Back to Course
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #faf5ff 100%)", py: { xs: 3, md: 5 } }}>
      <ToastContainer position="top-right" autoClose={2000} />
      <Container maxWidth="lg">
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ textTransform: "none", color: COLORS.textMuted, fontWeight: 600, mb: 2 }}>
          Back
        </Button>

        {/* Header */}
        <Card sx={{ borderRadius: "20px", mb: 4, p: { xs: 3, md: 4 }, background: COLORS.gradient, color: "#fff", boxShadow: `0 15px 40px ${COLORS.shadow}` }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <Avatar sx={{ background: "rgba(255,255,255,0.2)", width: 48, height: 48 }}>
              <QuizIcon />
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.9 }}>
                Quiz Hub
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.3rem", md: "1.7rem" } }}>
                Test Your Knowledge
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            <Chip icon={<HelpOutline sx={{ color: "#fff !important" }} />} label={`${totalQuestions} Questions`} size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 600 }} />
            <Chip icon={<QuizIcon sx={{ color: "#fff !important" }} />} label={`${totalQuizzes} Quizzes`} size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 600 }} />
            <Chip icon={<DoneAll sx={{ color: "#fff !important" }} />} label={`${submittedCount}/${totalQuizzes} Done`} size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 600 }} />
          </Stack>
        </Card>

        {/* Progress */}
        <Card sx={{ borderRadius: "16px", p: 2.5, mb: 4 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.2 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700 }}>Overall Progress</Typography>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: COLORS.primary }}>
              {submittedCount} / {totalQuizzes} completed
            </Typography>
          </Stack>
          <LinearProgress variant="determinate" value={(submittedCount / totalQuizzes) * 100} sx={{ height: 8, borderRadius: 4, backgroundColor: "#e2e8f0", "& .MuiLinearProgress-bar": { background: COLORS.gradient, borderRadius: 4 } }} />
        </Card>

        {/* Quizzes */}
        <Grid container spacing={3}>
          {quizzes.map((quiz, quizIndex) => {
            const quizSubmitted = !!submittedQuizzes[quiz._id];
            const quizResult = submittedQuizzes[quiz._id];
            const isSubmittingThis = submitting[quiz._id];
            const answeredInThisQuiz = answers[quizIndex]?.filter((a) => a !== null).length || 0;

            return (
              <Grid item xs={12} key={quiz._id}>
                <Card sx={{ borderRadius: "20px", background: "#fff", boxShadow: "0 4px 20px rgba(15, 23, 42, 0.06)", border: quizSubmitted ? `1.5px solid ${COLORS.success}40` : "1px solid rgba(226, 232, 240, 0.8)", overflow: "hidden" }}>
                  {/* ✅ FIX 3: Already attempted banner */}
                  {quizSubmitted && (
                    <Alert icon={<Lock />} severity="info" sx={{ borderRadius: "20px 20px 0 0", background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%)", color: "#065f46", "& .MuiAlert-icon": { color: COLORS.success }, "& .MuiAlert-message": { fontSize: "0.85rem", fontWeight: 600 } }}>
                      You've already completed this quiz — Score: <strong>{quizResult.score}/{quizResult.total}</strong>. Retake not allowed.
                    </Alert>
                  )}

                  {/* Quiz Header */}
                  <Box sx={{ p: { xs: 2.5, md: 3 }, background: quizSubmitted ? `${COLORS.success}08` : "linear-gradient(135deg, #eef2ff 0%, #faf5ff 100%)", borderBottom: "1px solid rgba(226, 232, 240, 0.6)" }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" useFlexGap gap={1.5}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar sx={{ background: quizSubmitted ? `linear-gradient(135deg, ${COLORS.success}, #059669)` : COLORS.gradient, width: 44, height: 44, fontWeight: 800 }}>
                          {quizSubmitted ? <CheckCircle /> : quizIndex + 1}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: { xs: "1rem", md: "1.15rem" }, color: COLORS.text }}>
                            {quiz.title}
                          </Typography>
                          <Typography sx={{ fontSize: "0.78rem", color: COLORS.textMuted }}>
                            {quiz.questions.length} question{quiz.questions.length > 1 ? "s" : ""}
                          </Typography>
                        </Box>
                      </Stack>

                      {quizSubmitted ? (
                        <Chip icon={<CheckCircle sx={{ color: "#fff !important" }} />} label={`Score: ${quizResult.score}/${quizResult.total}`} sx={{ background: `linear-gradient(135deg, ${COLORS.success}, #059669)`, color: "#fff", fontWeight: 700 }} />
                      ) : (
                        <Chip label={`${answeredInThisQuiz}/${quiz.questions.length} answered`} size="small" sx={{ background: "rgba(79, 70, 229, 0.1)", color: COLORS.primary, fontWeight: 700, fontSize: "0.72rem" }} />
                      )}
                    </Stack>
                  </Box>

                  {/* Questions */}
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Stack spacing={2.5}>
                      {quiz.questions.map((question, questionIndex) => {
                        const selected = answers[quizIndex]?.[questionIndex];
                        return (
                          <Box key={question._id}>
                            <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ mb: 1.5 }}>
                              <Avatar sx={{ width: 28, height: 28, background: selected ? COLORS.gradient : "#f1f5f9", color: selected ? "#fff" : COLORS.textMuted, fontWeight: 800, fontSize: "0.75rem" }}>
                                {questionIndex + 1}
                              </Avatar>
                              <Typography sx={{ fontWeight: 600, fontSize: "0.92rem", color: COLORS.text, pt: 0.3 }}>
                                {question.question}
                              </Typography>
                            </Stack>

                            <Stack spacing={1} sx={{ pl: { xs: 0, sm: 5 } }}>
                              {question.options.map((option, optionIndex) => {
                                const isSelected = selected === option;
                                return (
                                  <Box key={optionIndex} onClick={() => !quizSubmitted && handleSelectAnswer(quizIndex, questionIndex, option)} sx={{ p: 1.5, px: 2, borderRadius: "10px", border: "1.5px solid", borderColor: isSelected ? COLORS.primary : "#e2e8f0", background: isSelected ? "rgba(79,70,229,0.06)" : "#fff", cursor: quizSubmitted ? "not-allowed" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 1.5, opacity: quizSubmitted && !isSelected ? 0.5 : 1, "&:hover": !quizSubmitted ? { borderColor: COLORS.primary, background: "rgba(79,70,229,0.04)" } : {} }}>
                                    <Radio checked={isSelected} disabled={quizSubmitted} sx={{ p: 0, "&.Mui-checked": { color: COLORS.primary } }} />
                                    <Typography sx={{ fontSize: "0.88rem", color: COLORS.text, fontWeight: isSelected ? 600 : 500, flex: 1 }}>
                                      {option}
                                    </Typography>
                                  </Box>
                                );
                              })}
                            </Stack>

                            {questionIndex < quiz.questions.length - 1 && <Divider sx={{ mt: 2.5 }} />}
                          </Box>
                        );
                      })}
                    </Stack>

                    <Button fullWidth variant="contained" startIcon={quizSubmitted ? <Lock /> : null} endIcon={!quizSubmitted ? <ArrowForward /> : null} onClick={() => handleSubmit(quiz._id, quizIndex)} disabled={quizSubmitted || isSubmittingThis} sx={{ mt: 3, background: quizSubmitted ? "#94a3b8" : COLORS.gradient, textTransform: "none", fontWeight: 800, fontSize: "0.95rem", py: 1.4, borderRadius: "12px", boxShadow: quizSubmitted ? "none" : `0 8px 24px ${COLORS.shadow}`, "&:hover": { background: quizSubmitted ? "#94a3b8" : "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)" }, "&:disabled": { opacity: 1, color: "#fff" } }}>
                      {isSubmittingThis ? "Submitting..." : quizSubmitted ? "Already Attempted — Locked" : "Submit Quiz"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Final Results */}
        {allSubmitted && (
          <Zoom in>
            <Card sx={{ mt: 5, borderRadius: "24px", p: { xs: 3, md: 5 }, textAlign: "center", boxShadow: "0 20px 60px rgba(15, 23, 42, 0.12)", border: `2px solid ${overallPercentage >= 50 ? COLORS.success : COLORS.error}20` }}>
              <Avatar sx={{ width: 88, height: 88, mx: "auto", mb: 2, background: overallPercentage >= 50 ? COLORS.success : COLORS.error }}>
                {overallPercentage >= 50 ? <EmojiEvents sx={{ fontSize: 44 }} /> : <SentimentDissatisfied sx={{ fontSize: 44 }} />}
              </Avatar>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.5rem", md: "2rem" }, color: overallPercentage >= 50 ? COLORS.success : COLORS.error, mb: 1 }}>
                {overallPercentage >= 50 ? "🎉 Excellent Work!" : "Keep Practicing!"}
              </Typography>
              <Typography sx={{ color: COLORS.textMuted, mb: 3 }}>
                Final: {totalScoreObtained}/{totalAttemptedQuestions} ({overallPercentage}%)
              </Typography>
              
              {/* ✅ FIX 4: Retry button removed, only Back to Course */}
              <Button variant="contained" endIcon={<PlayCircleOutline />} onClick={() => navigate(`/user/lect/${courseId}`)} sx={{ background: COLORS.gradient, textTransform: "none", fontWeight: 700, borderRadius: "10px", px: 4, py: 1.3 }}>
                Back to Course
              </Button>
            </Card>
          </Zoom>
        )}
      </Container>
    </Box>
  );
};

export default QuizPage;
