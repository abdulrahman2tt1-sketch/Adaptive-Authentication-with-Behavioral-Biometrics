const axios = require("axios");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendOTPEmail } = require("../services/emailService");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already used" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashed,
      role,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // AI Integration
    // try {
    //   const aiResponse = await axios.post(
    //     "https://mohamedew-gradpr.hf.space/login-check",
    //     {
    //       userId: user._id.toString(),
    //       session: {
    //         loginTime: Date.now(),
    //         userAgent: req.headers["user-agent"],
    //         ip: req.ip,
    //       },
    //       twofa_passed: false,
    //     }
    //   );

    //   console.log("AI RESULT:", aiResponse.data);

    //   // لو صاحبك عايز يستخدم القرار بعد كده
    //   // const { decision, risk, status } = aiResponse.data;
    // } catch (err) {
    //   console.error("AI ERROR:", err.message);
    // }

    // Generate 6-digit OTP
    const otpPlain = crypto.randomInt(100000, 999999).toString();

    // Hash OTP before storing
    const otpSalt = await bcrypt.genSalt(10);
    const otpHashed = await bcrypt.hash(otpPlain, otpSalt);

    // Save OTP and expiration (5 minutes) to user document
    user.otp = otpHashed;
    user.otpExpire = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    // Send OTP email via Brevo
    try {
      await sendOTPEmail(user.email, user.name, otpPlain);
      console.log("OTP email sent to:", user.email);
    } catch (emailErr) {
      console.error("Failed to send OTP email:", emailErr.message);
      return res
        .status(500)
        .json({
          message: "Failed to send verification email. Please try again.",
        });
    }

    // Return requireOTP flag (no token yet)
    res.json({ requireOTP: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if OTP exists
    if (!user.otp || !user.otpExpire) {
      return res
        .status(400)
        .json({ message: "No OTP requested. Please login again." });
    }

    // Check if OTP is expired
    if (user.otpExpire < new Date()) {
      // Clear expired OTP
      user.otp = null;
      user.otpExpire = null;
      await user.save();
      return res
        .status(400)
        .json({
          message: "OTP has expired. Please login again to get a new code.",
        });
    }

    // Compare submitted OTP with stored hash
    const isMatch = await bcrypt.compare(otp, user.otp);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid OTP. Please try again." });
    }

    // OTP is valid — clear it from the database
    user.otp = null;
    user.otpExpire = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ─── Send Re-Verification OTP (for medium-risk behavioral detection) ─────────
// The user is already authenticated (has a valid JWT).
// We look up their email, generate a new OTP, and send it via Brevo.
exports.sendReverifyOTP = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6-digit OTP
    const otpPlain = crypto.randomInt(100000, 999999).toString();

    // Hash OTP before storing
    const otpSalt = await bcrypt.genSalt(10);
    const otpHashed = await bcrypt.hash(otpPlain, otpSalt);

    // Save OTP and expiration (5 minutes) to user document
    user.otp = otpHashed;
    user.otpExpire = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    // Send OTP email via Brevo
    try {
      await sendOTPEmail(user.email, user.name, otpPlain);
      console.log("Re-verify OTP email sent to:", user.email);
    } catch (emailErr) {
      console.error("Failed to send re-verify OTP email:", emailErr.message);
      return res
        .status(500)
        .json({
          message: "Failed to send verification email. Please try again.",
        });
    }

    res.json({ success: true, email: user.email });
  } catch (err) {
    console.error("Send re-verify OTP error:", err);
    res.status(500).json({ message: err.message });
  }
};
