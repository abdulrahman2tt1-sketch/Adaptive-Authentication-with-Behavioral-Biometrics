import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api, { setAuthToken } from "./config/api";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Watchlist from "./pages/Watchlist";
import VerifyOTP from "./pages/VerifyOTP";

const getOrCreate = (key, factory) => {
  const saved = sessionStorage.getItem(key);
  if (saved !== null) return saved;
  const value = factory();
  sessionStorage.setItem(key, value);
  return value;
};

const avg = (arr) =>
  arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

function App() {
  const [message, setMessage] = useState("Welcome!");

  // 🔴 MODAL STATE
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [riskMessage, setRiskMessage] = useState("");

  const sessionId = useRef(getOrCreate("sessionId", () => crypto.randomUUID()));
  const sessionStart = useRef(
    Number(getOrCreate("sessionStart", () => Date.now())),
  );

  const mouseLast = useRef({ x: 0, y: 0, t: 0 });
  const mouseSpeeds = useRef([]);
  const mouseMoveCount = useRef(0);

  const lastKeyTime = useRef(null);
  const keyCount = useRef(0);

  const lastClickTime = useRef(null);
  const clickCount = useRef(0);

  const lastScrollTime = useRef(null);
  const scrollSpeeds = useRef([]);
  const scrollDeltas = useRef([]);
  const scrollCount = useRef(0);

  const focusStart = useRef(null);
  const dwellTimes = useRef([]);

  const failedLoginAttempts = useRef(0);
  const failedTransactions = useRef(0);

  // Guard flag: prevents medium-risk from repeatedly triggering OTP redirect
  // Always init to false — sessionStorage is the source of truth
  const verificationInProgress = useRef(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) setAuthToken(token);
  }, [token]);

  // Cooldown: after successful re-verify, ignore medium risk for 5 minutes
  const reverifyCompletedAt = useRef(
    Number(sessionStorage.getItem("reverifyCompletedAt") || 0),
  );
  const REVERIFY_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    window.__behavior = {
      recordFailedLogin: () => {
        failedLoginAttempts.current++;
      },
      recordFailedTransaction: () => {
        failedTransactions.current++;
      },
      clearVerificationFlag: () => {
        verificationInProgress.current = false;
        sessionStorage.removeItem("reverifyMode");
        // Record when verification completed for cooldown
        const now = Date.now();
        reverifyCompletedAt.current = now;
        sessionStorage.setItem("reverifyCompletedAt", now);
      },
    };
    return () => {
      delete window.__behavior;
    };
  }, []);

  const handleKeyDown = () => {
    keyCount.current++;
    lastKeyTime.current = Date.now();
  };

  const handleClick = () => {
    clickCount.current++;
    lastClickTime.current = Date.now();
  };

  const handleMouseMove = (e) => {
    const now = Date.now();
    mouseMoveCount.current++;

    if (mouseLast.current.t) {
      const dx = e.clientX - mouseLast.current.x;
      const dy = e.clientY - mouseLast.current.y;
      const dt = now - mouseLast.current.t || 1;

      mouseSpeeds.current.push(Math.sqrt(dx * dx + dy * dy) / dt);
    }

    mouseLast.current = { x: e.clientX, y: e.clientY, t: now };
  };

  const handleScroll = (e) => {
    const now = Date.now();
    scrollCount.current++;

    const dy = Math.abs(e.deltaY || 0);
    scrollDeltas.current.push(dy);

    if (lastScrollTime.current) {
      scrollSpeeds.current.push(dy / (now - lastScrollTime.current || 1));
    }

    lastScrollTime.current = now;
  };

  // ── Focus tracking ──
  useEffect(() => {
    const onFocus = (e) => {
      if (e.target.matches("input, textarea, select")) {
        focusStart.current = Date.now();
      }
    };

    const onBlur = (e) => {
      if (e.target.matches("input, textarea, select") && focusStart.current) {
        dwellTimes.current.push(Date.now() - focusStart.current);
        focusStart.current = null;
      }
    };

    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", onBlur);

    return () => {
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", onBlur);
    };
  }, []);

  // ── Send behavior every 5 sec ──
  useEffect(() => {
    const INTERVAL_MS = 7000;

    const interval = setInterval(() => {
      if (!userId) return;

      // ── Don't send behavior while user is on the OTP verification page ──
      // This prevents the loop: risk fires → redirect → App remounts → risk fires again
      if (window.location.pathname === "/verify-otp") return;

      const now = Date.now();
      const sessionDuration = Math.round((now - sessionStart.current) / 1000);
      const intervalMin = INTERVAL_MS / 60_000;

      const clicksPerMinute = Math.round(clickCount.current / intervalMin);
      const keysPerMinute = Math.round(keyCount.current / intervalMin);
      const scrollsPerMinute = Math.round(scrollCount.current / intervalMin);

      const activeDwell = focusStart.current
        ? Date.now() - focusStart.current
        : null;

      const allDwells = activeDwell
        ? [...dwellTimes.current, activeDwell]
        : dwellTimes.current;

      const payload = {
        sessionId: sessionId.current,
        failedLoginAttempts: failedLoginAttempts.current,
        failedTransactions: failedTransactions.current,
        // accessLocationConsistency: {
        //   timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        //   language: navigator.language,
        // },
        // deviceConsistency: {
        //   userAgent: navigator.userAgent,
        //   platform: navigator.platform,
        //   screen: `${window.screen.width}x${window.screen.height}`,
        //   language: navigator.language,
        // },
        passwordResets: 0,
        accessLocationConsistency: 1,
        deviceConsistency: 1,
        sessionDuration,
        dwellTime: Math.round(avg(allDwells)),
        mouseMovements: Math.round(avg(mouseSpeeds.current) * 1000) / 1000,
        scrollBehavior: Math.round(avg(scrollSpeeds.current) * 1000) / 1000,
        accessFrequency: Math.round(
          clicksPerMinute + keysPerMinute + scrollsPerMinute,
        ),
      };

      api
        .post("/behavior", payload)
        .then((res) => {
          const risk = res.data?.aiRiskScore;

          // ── HIGH RISK (≥ 17): immediate logout ──
          if (risk >= 15.0) {
            setRiskMessage(
              "⚠️ High security risk detected! Logging you out...",
            );
            setShowRiskModal(true);

            setTimeout(() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.href = "/login";
            }, 5000);
          }

          // ── MEDIUM RISK (10–17): OTP re-verification ──
          else if (risk >= 8.0 && risk < 15.0) {
            // Guard 1: already pending (in-memory or sessionStorage)
            if (
              verificationInProgress.current ||
              sessionStorage.getItem("reverifyMode") === "true"
            )
              return;

            // Guard 2: cooldown — user just verified recently, don't re-trigger
            const cooldownRemaining =
              reverifyCompletedAt.current + REVERIFY_COOLDOWN_MS - Date.now();
            if (cooldownRemaining > 0) return;

            // Lock immediately before any async work
            verificationInProgress.current = true;
            sessionStorage.setItem("reverifyMode", "true");

            setRiskMessage(
              "⚠️ Unusual activity detected. Additional verification is required.",
            );
            setShowRiskModal(true);

            const userEmail = JSON.parse(
              localStorage.getItem("user") || "{}",
            ).email;
            api
              .post("/auth/send-reverify-otp")
              .then((otpRes) => {
                sessionStorage.setItem(
                  "otpEmail",
                  otpRes.data.email || userEmail,
                );
                setTimeout(() => {
                  setShowRiskModal(false);
                  window.location.href = "/verify-otp";
                }, 3000);
              })
              .catch((otpErr) => {
                console.error("Failed to send re-verify OTP:", otpErr);
                // Reset guard so the next interval can retry
                verificationInProgress.current = false;
                sessionStorage.removeItem("reverifyMode");
                setTimeout(() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.href = "/login";
                }, 3000);
              });
          }

          setMessage("Behavior sent at " + new Date().toLocaleTimeString());
        })
        .catch((err) => console.error("Behavior send error", err));

      // reset counters
      mouseSpeeds.current = [];
      mouseMoveCount.current = 0;
      scrollSpeeds.current = [];
      scrollDeltas.current = [];
      scrollCount.current = 0;
      clickCount.current = 0;
      keyCount.current = 0;
      dwellTimes.current = [];
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, [userId]);

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onWheel={handleScroll}
    >
      <p className="mb-4">{message}</p>

      {/* 🔴 MODAL */}
      {showRiskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999]">
          <div className="bg-white w-[320px] p-6 rounded-xl shadow-2xl text-center">
            <div className="text-4xl mb-2">⚠️</div>

            <h2 className="text-xl font-bold text-red-600 mb-2">
              Security Alert
            </h2>

            <p className="text-gray-700 mb-4">{riskMessage}</p>

            <div className="text-sm text-gray-500 animate-pulse">
              Redirecting...
            </div>
          </div>
        </div>
      )}

      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:slug" element={<CourseDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
