const mongoose = require("mongoose");

const behaviorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sessionId: { type: String, required: true },

  // ─── Authentication ───────────────────────────────────────────
  failedLoginAttempts: { type: Number, default: 0 },

  // ─── Transactions ─────────────────────────────────────────────
  failedTransactions: { type: Number, default: 0 },

  passwordResets: { type: Number, default: 0 },
  accessLocationConsistency: { type: Number, default: 0 },
  deviceConsistency: { type: Number, default: 0 }, // 0-1 score based on device fingerprint consistency
  // ─── Session ──────────────────────────────────────────────────
  sessionDuration: { type: Number, default: 0 }, // seconds

  // ─── Interaction Metrics ──────────────────────────────────────
  dwellTime: { type: Number, default: 0 }, // ms – avg time on inputs (focus → blur)
  mouseMovements: { type: Number, default: 0 }, // avg mouse speed px/ms
  scrollBehavior: { type: Number, default: 0 }, // avg scroll speed px/ms
  accessFrequency: { type: Number, default: 0 }, // total interactions per minute

  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Behavior", behaviorSchema);
