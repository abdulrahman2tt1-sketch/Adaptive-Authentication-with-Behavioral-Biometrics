import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, BookOpen, RotateCcw } from "lucide-react";
import api, { setAuthToken } from "../config/api";

function VerifyOTP() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem("otpEmail");

  // Detect mode: re-verification (medium-risk) vs login
  const isReverify = sessionStorage.getItem("reverifyMode") === "true";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  const inputRefs = useRef([]);

  // Redirect if no email in session
  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split("");
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  // ── Force logout helper ──
  const forceLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/verify-otp", {
        email,
        otp: otpString,
      });

      if (data.token) {
        if (isReverify) {
          // ── Re-verification mode: keep session alive ──
          // Update the token (backend issued a fresh one)
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("userId", data.user?.id);
          localStorage.setItem("role", data.user?.role);
          setAuthToken(data.token);

          // Clear re-verification flags
          sessionStorage.removeItem("reverifyMode");
          sessionStorage.removeItem("otpEmail");

          // Clear the behavioral monitoring guard flag
          window.__behavior?.clearVerificationFlag();

          // Navigate back to the application
          navigate("/");
        } else {
          // ── Login mode: original behavior ──
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("userId", data.user?.id);
          localStorage.setItem("role", data.user?.role);
          sessionStorage.setItem("sessionStart", Date.now());
          sessionStorage.removeItem("otpEmail");

          setAuthToken(data.token);

          navigate("/");
          window.location.reload();
        }
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message || err.message || "Verification failed";
      setError(errMsg);

      // In re-verify mode, if OTP is invalid/expired → log out after a short delay
      if (isReverify) {
        setTimeout(() => {
          forceLogout();
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (isReverify) {
      // ── Re-verify mode: use the authenticated endpoint ──
      setResending(true);
      setError("");
      setSuccess("");

      try {
        await api.post("/auth/send-reverify-otp");

        setOtp(["", "", "", "", "", ""]);
        setTimeLeft(300);
        setSuccess("A new verification code has been sent to your email.");
        inputRefs.current[0]?.focus();
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to resend code. Please try again."
        );
      } finally {
        setResending(false);
      }
    } else {
      // ── Login mode: original resend behavior ──
      const savedPassword = sessionStorage.getItem("otpPassword");

      if (!email || !savedPassword) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      setResending(true);
      setError("");
      setSuccess("");

      try {
        await api.post("/auth/login", {
          email,
          password: savedPassword,
        });

        setOtp(["", "", "", "", "", ""]);
        setTimeLeft(300);
        setSuccess("A new verification code has been sent to your email.");
        inputRefs.current[0]?.focus();
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to resend code. Please try again."
        );
      } finally {
        setResending(false);
      }
    }
  };

  const isExpired = timeLeft <= 0;

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background to-muted/40">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
          </Link>

          <div className="flex items-center justify-center gap-2 mb-3">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              {isReverify ? "Verify Your Identity" : "Verify Your Email"}
            </h1>
          </div>

          <p className="text-muted-foreground text-sm">
            {isReverify ? (
              <>
                Unusual activity was detected. A 6-digit verification code has been sent to{" "}
                <span className="font-medium text-foreground">{email}</span>
              </>
            ) : (
              <>
                We sent a 6-digit code to{" "}
                <span className="font-medium text-foreground">{email}</span>
              </>
            )}
          </p>
        </div>

        {/* Card */}
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Timer */}
            <div className="text-center">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  isExpired
                    ? "bg-destructive/10 text-destructive"
                    : timeLeft <= 60
                      ? "bg-yellow-500/10 text-yellow-600"
                      : "bg-primary/10 text-primary"
                }`}
              >
                <span className="relative flex h-2 w-2">
                  {!isExpired && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                  )}
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                </span>
                {isExpired ? "Code expired" : `Expires in ${formatTime(timeLeft)}`}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
                {isReverify && (
                  <p className="mt-1 text-xs opacity-75">
                    You will be logged out shortly...
                  </p>
                )}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-600 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-background/60
                    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all
                    ${digit ? "border-primary bg-primary/5" : "border-border"}
                    ${isExpired ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                  disabled={isExpired || loading}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || isExpired || otp.join("").length !== 6}
              className="w-full py-3 rounded-xl font-medium text-white btn-primary
                hover:btn-primary/90 active:scale-[0.98] transition-all shadow-md
                disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying...
                </span>
              ) : isReverify ? (
                "Verify Identity"
              ) : (
                "Verify & Sign In"
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <RotateCcw className={`w-4 h-4 ${resending ? "animate-spin" : ""}`} />
              {resending ? "Sending..." : "Resend Code"}
            </button>
          </div>

          {/* Back to login */}
          <p className="text-center mt-6 text-sm text-muted-foreground">
            {isReverify ? (
              <>
                Can't verify?{" "}
                <button
                  onClick={forceLogout}
                  className="text-primary font-medium hover:underline"
                >
                  Log out and sign in again
                </button>
              </>
            ) : (
              <>
                Wrong email?{" "}
                <Link
                  to="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Go back to login
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;

