"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Add this import for icons
import { useUser } from "@/src/context/UserContext";

export default function LoginPage() {
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [activeField, setActiveField] = useState<string | null>(null);
  const [hologramProgress, setHologramProgress] = useState(0);
  const [scanLine, setScanLine] = useState(0);
  const [showPassword, setShowPassword] = useState(false); // Correct variable name
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { user,  } = useUser();

  useEffect(() => {
    if (!loading && user) {
      console.log("🔁 User already authenticated, redirecting to dashboard");
      router.replace("/dashboard");
    }
  }, [user, loading, router]);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setHologramProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 50);

    const scanInterval = setInterval(() => {
      setScanLine((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 100);

    return () => {
      clearInterval(progressInterval);
      clearInterval(scanInterval);
    };
  }, []);

  const binaryCharacters = Array.from({ length: 50 }).map((_, i) => ({
    char: i % 2 === 0 ? "1" : "0",
    left: `${(i * 3.8) % 100}%`,
  }));

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "Login failed");
      } else {
        setMsg("Login successful! Redirecting...");
        await new Promise((resolve) => setTimeout(resolve, 120));
        router.push("/dashboard");
      }
    } catch (err) {
      setMsg("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gray-950 p-6 overflow-hidden">
      {/* Cyber Matrix Background */}
      <div className="absolute inset-0">
        {/* Binary Rain Effect */}
        {isClient && (
          <div className="absolute inset-0 overflow-hidden">
            {binaryCharacters.map((item, i) => (
              <motion.div
                key={i}
                className="absolute font-mono text-cyan-400/20 text-sm"
                initial={{
                  x: 0,
                  y: -50,
                }}
                animate={{
                  y: "100vh",
                }}
                transition={{
                  duration: Math.random() * 10 + 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
                style={{
                  left: item.left,
                }}
              >
                {item.char}
              </motion.div>
            ))}
          </div>
        )}

        {/* Neon Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 49.5%, rgba(0, 255, 255, 0.1) 50%, transparent 50.5%),
              linear-gradient(0deg, transparent 49.5%, rgba(0, 255, 255, 0.1) 50%, transparent 50.5%)
            `,
            backgroundSize: "60px 60px",
            opacity: 0.3,
          }}
        />

        {/* Anime Cyber City Silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 opacity-10">
          <div className="flex items-end h-full">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-cyan-500/30 to-transparent"
                style={{
                  height: `${30 + (i % 5) * 14}%`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Login Interface */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10"
      >
        {/* Outer Glow Ring */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-20 animate-pulse"></div>

        <form
          onSubmit={handleSubmit}
          className="relative space-y-8 p-10 bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-2xl"
        >
          {/* Terminal Header */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
              LOGIN
            </h1>
          </div>

          {/* Status Display */}
          {msg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={`p-4 rounded-lg border ${
                msg.includes("successful")
                  ? "border-green-500/30 bg-green-500/10"
                  : "border-red-500/30 bg-red-500/10"
              }`}
            >
              <div className="flex items-start font-mono text-sm">
                <span
                  className={`mr-2 ${
                    msg.includes("successful")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {">"}
                </span>
                <span
                  className={
                    msg.includes("successful")
                      ? "text-green-300"
                      : "text-red-300"
                  }
                >
                  {msg}
                </span>
              </div>
            </motion.div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-mono text-cyan-400">
              EMAIL ADDRESS / PHONE NUMBER
            </label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-transparent rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
              <input
                name="identifier"
                type="text"
                required
                value={form.identifier}
                onChange={handleChange}
                onFocus={() => setActiveField("identifier")}
                onBlur={() => setActiveField(null)}
                className="relative w-full p-4 bg-gray-900/70 border border-cyan-500/20 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
                placeholder="ENTER_CREDENTIALS"
              />
              {activeField === "identifier" && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  className="absolute bottom-0 left-0 h-0.5 bg-cyan-500"
                />
              )}
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-mono text-cyan-400">
                PASSWORD
              </label>
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

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-transparent rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={handleChange}
                onFocus={() => setActiveField("password")}
                onBlur={() => setActiveField(null)}
                className="relative w-full p-4 pr-12 bg-gray-900/70 border border-cyan-500/20 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
                placeholder="••••••••••••"
              />

              {/* Security Level Indicator */}
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`w-1 h-4 rounded-full transition-all ${
                        form.password.length >= level * 3
                          ? "bg-gradient-to-b from-cyan-400 to-cyan-600"
                          : "bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {activeField === "password" && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  className="absolute bottom-0 left-0 h-0.5 bg-cyan-500"
                />
              )}
            </div>
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-cyan-700/30 to-blue-700/30 border border-cyan-500/50 text-white font-mono font-bold rounded-lg hover:border-cyan-400 hover:from-cyan-600/40 hover:to-blue-600/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            <div className="relative flex items-center justify-center space-x-3">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-cyan-300">LOGGING</span>
                </>
              ) : (
                <>
                  <span>LOGIN</span>
                  <span className="text-cyan-300 animate-pulse">→</span>
                </>
              )}
            </div>
          </motion.button>

          {/* Registration Link */}
          <div className="text-center pt-4 border-t border-cyan-500/20">
            <p className="text-gray-400 font-mono text-sm">
              New user{" "}
              <Link
                href="/register"
                className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors group"
              >
                <span className="relative">
                  REGISTER HERE
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </span>
              </Link>
            </p>
          </div>

          {/* Forgot Password Link */}
          <div className="text-center text-xs font-mono text-cyan-400/70">
            <Link
              href="/forgot"
              className="hover:text-cyan-300 transition-colors group inline-block"
            >
              <span className="relative">
                Forgot Password?
                <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </span>
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
