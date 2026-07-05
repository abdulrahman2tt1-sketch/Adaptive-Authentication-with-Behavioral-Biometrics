const express = require("express");
const Behavior = require("../models/Behavior");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const router = express.Router();

// ─── Auth Middleware ───────────────────────────────────────────────────────────
const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token" });
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId || decoded.id || decoded._id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ─── POST /api/behavior ───────────────────────────────────────────────────────
// Save a behavior snapshot (called every N seconds from the frontend)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      sessionId,
      failedLoginAttempts,
      failedTransactions,
      accessLocationConsistency,
      deviceConsistency,
      passwordResets,
      sessionDuration,
      dwellTime,
      mouseMovements,
      scrollBehavior,
      accessFrequency,
    } = req.body;

    const b = new Behavior({
      userId: req.userId,
      sessionId,
      failedLoginAttempts: failedLoginAttempts ?? 0,
      failedTransactions: failedTransactions ?? 0,
      accessLocationConsistency,
      deviceConsistency,
      passwordResets,
      sessionDuration,
      dwellTime,
      mouseMovements,
      scrollBehavior,
      accessFrequency,
    });

    await b.save();

    const aiResponse = await axios.post(
      "https://mohamedew-gradpr.hf.space/login-check",
      {
        userId: req.userId.toString(),
        session: {
          // loginTime: Date.now(),
          // userAgent: req.headers["user-agent"],
          // ip: req.ip,
          sessionId,
          failedLoginAttempts: failedLoginAttempts ?? 0,
          failedTransactions: failedTransactions ?? 0,
          accessLocationConsistency,
          deviceConsistency,
          passwordResets,
          sessionDuration,
          dwellTime,
          mouseMovements,
          scrollBehavior,
          accessFrequency,
        },
        twofa_passed: true,
      },
    );
    console.log("AI REQUEST:", {
      userId: req.userId.toString(),
      sessionId,
      failedLoginAttempts: failedLoginAttempts ?? 0,
      failedTransactions: failedTransactions ?? 0,
      accessLocationConsistency,
      deviceConsistency,
      passwordResets,
      sessionDuration,
      dwellTime,
      mouseMovements,
      scrollBehavior,
      accessFrequency,
    });
    console.log("AI RESULT:", aiResponse.data);

    res.status(201).json({
      message: "Behavior saved",
      aiRiskScore: aiResponse.data.risk,
      behavior: b,
    });
  } catch (err) {
    console.log("========== AI ERROR ==========");
    console.log("STATUS:", err.response?.status);
    console.log("HEADERS:", err.response?.headers);
    console.log("DATA:", err.response?.data);
    console.log("==============================");

    res.status(500).json({
      error: err.response?.data,
    });
  }
});

// ─── PATCH /api/behavior/failed-login ─────────────────────────────────────────
// Increment failedLoginAttempts for the latest open session of a user.
// Called right after a failed login — no auth token required (user isn't logged in).
router.patch("/failed-login", async (req, res) => {
  try {
    const { userId, sessionId } = req.body;
    if (!userId || !sessionId)
      return res.status(400).json({ message: "userId and sessionId required" });

    await Behavior.findOneAndUpdate(
      { userId, sessionId },
      { $inc: { failedLoginAttempts: 1 } },
      { upsert: true, new: true },
    );

    res.json({ message: "failedLoginAttempts incremented" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── PATCH /api/behavior/failed-transaction ────────────────────────────────────
// Increment failedTransactions for the current session (protected).
router.patch("/failed-transaction", authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId)
      return res.status(400).json({ message: "sessionId required" });

    await Behavior.findOneAndUpdate(
      { userId: req.userId, sessionId },
      { $inc: { failedTransactions: 1 } },
      { upsert: true, new: true },
    );

    res.json({ message: "failedTransactions incremented" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── GET /api/behavior/latest/:userId ─────────────────────────────────────────
// Fetch the latest behavior record for a user (admin / debugging).
router.get("/latest/:userId", async (req, res) => {
  try {
    const latest = await Behavior.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(1);
    res.json({ latest: latest[0] || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── GET /api/behavior/history/:userId ────────────────────────────────────────
// Fetch the last N records for trend analysis (admin / debugging).
router.get("/history/:userId", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const records = await Behavior.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(limit);
    res.json({ records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
