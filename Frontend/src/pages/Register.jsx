import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, BookOpen } from "lucide-react";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5001/api/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // لو عندك JWT وعايز تخزنه
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user?.id);
        localStorage.setItem("role", data.user?.role || data.role);
      }

      navigate("/login"); // أو dashboard لو حابب
    } catch (err) {
      // axios error handling
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background to-muted/40">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
          </Link>

          <h1 className="text-3xl font-bold text-foreground">Create account</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Start your learning journey today
          </p>
        </div>

        {/* Card */}
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>

              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition" />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background/60 
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background/60 
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-border bg-background/60 
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                Must be at least 6 characters
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-medium text-white btn-primary 
          hover:btn-primary/90 active:scale-[0.98] transition-all shadow-md disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
