"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isClient, setIsClient] = useState(false); // Add this

  useEffect(() => {
    setIsClient(true); // Set to true only on client
  }, []);

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

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "Registration failed");
      } else {
        setMsg("Registration successful! Redirecting...");
        window.location.href = "/dashboard";
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
              <label className="block text-sm font-mono text-cyan-400 mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setActiveField("password")}
                  onBlur={() => setActiveField(null)}
                  className="w-full p-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
                <div className="absolute right-3 top-3">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`w-1 h-3 rounded-full ${
                          form.password.length >= i * 3
                            ? "bg-cyan-500"
                            : "bg-gray-600"
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
                {activeField === "password" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                )}
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
                />
                {activeField === "referral" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar Animation */}
          {/*  */}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-mono font-bold rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            {/* Button Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-50 transition-opacity"></div>
            
            {/* Button Text */}
            <span className="relative flex items-center justify-center">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  REGISTERING
                </>
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

        {/* Terminal-like Footer */}
        <div className="mt-6 p-4 bg-black/50 border border-cyan-500/20 rounded-lg font-mono text-xs text-cyan-400/70">
          <div className="flex items-center">
            <div className="text-green-400 mr-2">$</div>
            <div className="animate-pulse">
              Financial_Powerhouse_Network © 2024 | Secure_Connection_Established
            </div>
          </div>
        </div>
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