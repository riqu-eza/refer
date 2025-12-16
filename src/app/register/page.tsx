"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    referral: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [activeField, setActiveField] = useState<string | null>(null);
  const [hologramProgress, setHologramProgress] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    if (form.password.length >= 8) strength += 25;
    if (/[A-Z]/.test(form.password)) strength += 25;
    if (/[0-9]/.test(form.password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(form.password)) strength += 25;
    setPasswordStrength(strength);
  }, [form.password]);

  const getStrengthColor = (strength: number) => {
    if (strength < 50) return "bg-red-500";
    if (strength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength < 50) return "Weak";
    if (strength < 75) return "Fair";
    return "Strong";
  };

  // FIX: handle window only on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      if (ref) {
        setForm((f) => ({ ...f, referral: ref }));
      }
    }

    // Cyber animation progress
    const interval = setInterval(() => {
      setHologramProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Generate deterministic particle positions for server render
  const particlePositions = Array.from({ length: 20 }).map((_, i) => ({
    x: `${(i * 5.7) % 100}vw`, // Deterministic calculation
    y: `${(i * 7.3) % 100}vh`, // Deterministic calculation
  }));

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    // Password validation
    if (form.password.length < 8) {
      setMsg("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    if (passwordStrength < 50) {
      setMsg("Please choose a stronger password");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "Registration failed");
      } else {
        setMsg("Registration successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      }
    } catch (err) {
      setMsg("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gray-950 p-6 overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 98%, rgba(0, 255, 255, 0.1) 99%),
              linear-gradient(0deg, transparent 98%, rgba(0, 255, 255, 0.1) 99%)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Animated Grid Lines - Only on client */}
        {isClient && (
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, transparent 50%, rgba(0, 255, 255, 0.05) 50%)`,
              backgroundSize: '100px 100px',
              animation: 'gridMove 20s linear infinite'
            }}
          />
        )}
        
        {/* Anime Character Silhouette */}
        <div className="absolute right-10 bottom-10 w-64 h-80 opacity-10">
          <div className="relative w-full h-full">
            {/* Cyber samurai silhouette */}
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent clip-path-samurai"></div>
          </div>
        </div>

        {/* Floating Data Particles - Only on client with deterministic positions */}
        {isClient && particlePositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            initial={{
              x: pos.x,
              y: pos.y,
            }}
            animate={{
              y: [null, '-100vh'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Holographic Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg z-10"
      >
        {/* Card Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-30"></div>
        
        <form
          onSubmit={handleSubmit}
          className="relative w-full space-y-6 p-10 bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-cyan-500/20 shadow-2xl"
        >
          {/* Card Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-cyan-400 text-sm font-mono">
              REGISTRATION 
            </div>
          </div>

          {/* Title with Glitch Effect */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
              CREATE ACCOUNT
            </h1>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-cyan-500 to-transparent"></div>
            <p className="text-gray-400 text-sm mt-2 font-mono">
              JOIN THE FINANCIAL POWERHOUSE
            </p>
          </div>

          {/* Status Message */}
          {msg && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-lg border ${
                msg.includes("successful")
                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                  : "border-red-500/30 bg-red-500/10 text-red-400"
              } text-sm font-mono`}
            >
              {">"} {msg}
            </motion.div>
          )}

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="relative group">
              <label className="block text-sm font-mono text-cyan-400 mb-2">
                FULL NAME
              </label>
              <div className="relative">
                <input
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setActiveField("name")}
                  onBlur={() => setActiveField(null)}
                  className="w-full p-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
                {activeField === "name" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                )}
              </div>
            </div>

            {/* Phone Field */}
            <div className="relative group">
              <label className="block text-sm font-mono text-cyan-400 mb-2">
                PHONE NUMBER
              </label>
              <div className="relative">
                <input
                  name="phone"
                  type="text"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  onFocus={() => setActiveField("phone")}
                  onBlur={() => setActiveField(null)}
                  className="w-full p-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
                {activeField === "phone" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="md:col-span-2 relative group">
              <label className="block text-sm font-mono text-cyan-400 mb-2">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setActiveField("email")}
                  onBlur={() => setActiveField(null)}
                  className="w-full p-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
                {activeField === "email" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="md:col-span-2 relative group">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-mono text-cyan-400">
                  PASSWORD
                </label>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-mono ${
                    passwordStrength < 50 ? "text-red-400" :
                    passwordStrength < 75 ? "text-yellow-400" :
                    "text-green-400"
                  }`}>
                    {getStrengthText(passwordStrength)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-mono flex items-center gap-1"
                  >
                    {showPassword ? (
                      <>
                        <FiEyeOff className="w-3 h-3" />
                        HIDE
                      </>
                    ) : (
                      <>
                        <FiEye className="w-3 h-3" />
                        SHOW
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setActiveField("password")}
                  onBlur={() => setActiveField(null)}
                  className="w-full p-3 pr-12 bg-gray-900/50 border border-cyan-500/30 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="Enter secure password"
                />
                
                {/* Password strength indicator bar */}
                <div className="mt-3">
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getStrengthColor(passwordStrength)} transition-all duration-300`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  
                  {/* Password requirements */}
                  {/* {form.password && (
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-gray-400">
                      <div className={`flex items-center gap-1 ${form.password.length >= 8 ? "text-green-400" : ""}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${form.password.length >= 8 ? "bg-green-500" : "bg-gray-600"}`} />
                        Min. 8 characters
                      </div>
                      <div className={`flex items-center gap-1 ${/[A-Z]/.test(form.password) ? "text-green-400" : ""}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(form.password) ? "bg-green-500" : "bg-gray-600"}`} />
                        Uppercase letter
                      </div>
                      <div className={`flex items-center gap-1 ${/[0-9]/.test(form.password) ? "text-green-400" : ""}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(form.password) ? "bg-green-500" : "bg-gray-600"}`} />
                        Number
                      </div>
                      <div className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(form.password) ? "text-green-400" : ""}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${/[^A-Za-z0-9]/.test(form.password) ? "bg-green-500" : "bg-gray-600"}`} />
                        Special character
                      </div>
                    </div>
                  )} */}
                </div>
                
                {/* {activeField === "password" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                )} */}
              </div>
            </div>

            {/* Referral Field */}
            <div className="md:col-span-2 relative group">
              <label className="block text-sm font-mono text-cyan-400 mb-2">
                REFERRAL CODE (optional)
              </label>
              <div className="relative">
                <input
                  name="referral"
                  type="text"
                  value={form.referral}
                  onChange={handleChange}
                  onFocus={() => setActiveField("referral")}
                  onBlur={() => setActiveField(null)}
                  className="w-full p-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="Enter referral code if any"
                />
                {form.referral && (
                  <div className="absolute right-3 top-3">
                    <div className="text-xs text-green-400 font-mono">
                      REFERRAL APPLIED
                    </div>
                  </div>
                )}
                {activeField === "referral" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading || passwordStrength < 50}
            className={`w-full py-4 px-6 text-white font-mono font-bold rounded-lg transition-all duration-300 relative overflow-hidden group ${
              loading || passwordStrength < 50
                ? "bg-gray-700 cursor-not-allowed opacity-50"
                : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
            }`}
          >
            {/* Button Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-50 transition-opacity"></div>
            
            {/* Cyber Pattern Overlay */}
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            
            {/* Button Text */}
            <span className="relative flex items-center justify-center">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  REGISTERING
                </>
              ) : passwordStrength < 50 ? (
                "STRENGTHEN PASSWORD"
              ) : (
                "REGISTER"
              )}
            </span>
          </motion.button>

          {/* Login Link */}
          <p className="text-center text-gray-400 text-sm font-mono">
            ALREADY HAVE AN ACCOUNT?{" "}
            <a
              className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors group"
              href="/login"
            >
              <span className="relative">
                LOGIN_HERE
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </span>
            </a>
          </p>
        </form>

        {/* Security Footer */}
        
      </motion.div>

      {/* Add CSS for grid animation */}
      <style jsx>{`
        @keyframes gridMove {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(100px);
          }
        }
        
        .clip-path-samurai {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
      `}</style>
    </div>
  );
}