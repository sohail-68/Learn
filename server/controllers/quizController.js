const Quiz = require('../models/quize');

// ✅ Create a quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;
    const courseId = req.params.courseId;

    const quiz = await Quiz.create({
      course: courseId,
      title,
      questions
    });

    res.status(201).json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get quizzes for a course
exports.getQuizzesByCourse = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.status(200).json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const quizId = req.params.quizId;
    const userId = req.user._id; // from protect middleware
console.log("att");

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    // ─────────────────────────────────────────────
    // ✅ CHECK 1: Has user already attempted?
    // ─────────────────────────────────────────────
    const existingAttempt = quiz.attempts?.find(
      (a) => a.user.toString() === userId.toString()
    );

    if (existingAttempt) {
      return res.status(400).json({
        success: false,
        alreadyAttempted: true,
        message: "You have already attempted this quiz.",
        attempt: {
          score: existingAttempt.score,
          total: existingAttempt.total,
          submittedAt: existingAttempt.submittedAt,
        },
      });
    }

    // ─────────────────────────────────────────────
    // ✅ CHECK 2: Validate answers array
    // ─────────────────────────────────────────────
    if (!Array.isArray(answers)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid answers format" });
    }

    // ─────────────────────────────────────────────
    // ✅ CALCULATE SCORE (no negative scoring)
    // ─────────────────────────────────────────────
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++;
      }
      // ❌ NO score-- — wrong answer = 0 points
    });

    const total = quiz.questions.length;

    // ─────────────────────────────────────────────
    // ✅ SAVE THE ATTEMPT — this is the KEY FIX
    // ─────────────────────────────────────────────
    if (!quiz.attempts) {
      quiz.attempts = [];
    }

    quiz.attempts.push({
      user: userId,
      score: score,
      total: total,
      submittedAt: new Date(),
    });

    await quiz.save(); // ✅ PERSIST to database

    // ─────────────────────────────────────────────
    // ✅ RETURN SUCCESS
    // ─────────────────────────────────────────────
    res.status(200).json({
      success: true,
      score,
      total,
      message: "Quiz submitted successfully!",
    });
  } catch (error) {
    console.error("submitQuiz error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ✅ Get quizzes by title (case-insensitive search)
exports.getQuizzesByTitle = async (req, res) => {
  try {
    const { title } = req.query; // Get title from query params

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    // Use a case-insensitive regex to match titles
    const quizzes = await Quiz.find({ title: { $regex: title, $options: 'i' } });

    res.status(200).json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
