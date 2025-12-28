/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { WHEEL_SEGMENTS } from "@/src/config/Wheel";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Star,
  Gift,
  Coins,
  Sparkles,
  Trophy,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Wallet,
  ArrowRightLeft,
  CreditCard,
  TrendingUp,
  Crown,
  Shield,
  Award,
  Clock,
  BarChart3,
  Gem,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  History,
} from "lucide-react";
import { useUser } from "@/src/context/UserContext";

const TOTAL_SEGMENTS = WHEEL_SEGMENTS.length;
const SEGMENT_ANGLE = 360 / TOTAL_SEGMENTS;
const NEAR_MISS_THRESHOLD = 0.15;
const POINTS_TO_FIAT_RATE = 10;
const MIN_POINTS_CONVERT = 10000;

// Responsive color function
const getSegmentColor = (index: number) => {
  const colors = [
    "from-cyan-500 to-blue-600",
    "from-emerald-500 to-green-600",
    "from-amber-500 to-yellow-600",
    "from-rose-500 to-pink-600",
    "from-purple-500 to-violet-600",
    "from-orange-500 to-red-600",
    "from-indigo-500 to-blue-600",
    "from-lime-500 to-green-600",
    "from-teal-500 to-emerald-600",
    "from-blue-500 to-cyan-600",
    "from-fuchsia-500 to-purple-600",
    "from-red-500 to-orange-600",
  ];
  return colors[index % colors.length];
};

// Responsive icon function
const getSegmentIcon = (type: string, size: "xs" | "sm" | "md" = "md") => {
  const iconSize = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  }[size];
  
  switch (type) {
    case "jackpot": return <Trophy className={`${iconSize} text-yellow-400`} />;
    case "big": return <Star className={`${iconSize} text-emerald-400`} />;
    case "medium": return <Gift className={`${iconSize} text-cyan-400`} />;
    case "small": return <Coins className={`${iconSize} text-amber-400`} />;
    default: return <Zap className={`${iconSize} text-purple-400`} />;
  }
};

interface WalletData {
  pointsBalance: number;
  fiatBalance: number;
}
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

export default function ResponsiveSpinWheel() {
  // State Management
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [nearMiss, setNearMiss] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState<any[]>([]);
  const [wallet, setWallet] = useState<WalletData>({ pointsBalance: 0, fiatBalance: 0 });
  const [converting, setConverting] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [convertAmount, setConvertAmount] = useState<string>("10000");
  const [redeemProgress, setRedeemProgress] = useState(0);
  const [showBalance, setShowBalance] = useState(true);
  const [spinHistory, setSpinHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const [showMobileStats, setShowMobileStats] = useState(false);
  const isMobile = useIsMobile();

  // Refs
  const wheelRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  // Effects
  useEffect(() => {
    fetchWalletData();
    fetchSpinsLeft();
    fetchSpinHistory();
  }, [user]);

  useEffect(() => {
    if (wallet.pointsBalance > 0) {
      const progress = Math.min((wallet.pointsBalance / MIN_POINTS_CONVERT) * 100, 100);
      setRedeemProgress(progress);
    }
  }, [wallet.pointsBalance]);

  // API Functions
  const fetchWalletData = async () => {
    try {
      const res = await fetch("/api/wallet", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setWallet({
          pointsBalance: data.pointsBalance || 0,
          fiatBalance: data.fiatBalance || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch wallet:", error);
    }
  };

  const fetchSpinsLeft = async () => {
    try {
      const res = await fetch("/api/spin/status", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setSpinsLeft(data.spinsLeft || 0);
      }
    } catch (error) {
      console.error("Failed to fetch spins left:", error);
    }
  };

  const fetchSpinHistory = async () => {
    try {
      const res = await fetch("/api/spin/history", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setSpinHistory(data.slice(0, 5) || []);
      }
    } catch (error) {
      console.error("Failed to fetch spin history:", error);
    }
  };

  // Animation Functions
  const createConfetti = () => {
    const particles = [];
    const colors = ['#00ffff', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];
    
    for (let i = 0; i < 80; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 12 + 5,
        rotation: Math.random() * 360,
        shape: Math.random() > 0.5 ? 'circle' : 'rect',
      });
    }
    
    setConfettiParticles(particles);
    
    setTimeout(() => {
      setConfettiParticles([]);
    }, 4000);
  };

  const triggerNearMissEffect = () => {
    if (wheelRef.current) {
      wheelRef.current.classList.add("animate-shake");
      setTimeout(() => {
        wheelRef.current?.classList.remove("animate-shake");
      }, 800);
    }
  };

  // Main Functions
  async function handleSpin() {
    if (spinning || spinsLeft <= 0) return;

    setSpinning(true);
    setResult(null);
    setNearMiss(false);
    setShowCelebration(false);
    setConfettiParticles([]);

    try {
      const res = await fetch("/api/spin", { 
        method: "POST", 
        credentials: "include" 
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        setSpinning(false);
        return;
      }

      // Near miss chance
      const isNearMiss = Math.random() < NEAR_MISS_THRESHOLD;
      if (isNearMiss) {
        setNearMiss(true);
        triggerNearMissEffect();
      }

      // Calculate rotation
      const possibleIndexes = WHEEL_SEGMENTS
        .map((seg, i) => (seg.type === data.bucket ? i : null))
        .filter((i) => i !== null) as number[];

      const chosenIndex = possibleIndexes[Math.floor(Math.random() * possibleIndexes.length)];
      const spins = 7 + Math.random() * 3;
      const randomOffset = (Math.random() - 0.5) * 20;
      const angle = spins * 360 + (360 - chosenIndex * SEGMENT_ANGLE - SEGMENT_ANGLE / 2) + randomOffset;

      setRotation((prev) => prev + angle);

      setTimeout(async () => {
        setResult(data);
        setSpinsLeft(data.spinsLeft || spinsLeft - 1);
        
        await Promise.all([fetchWalletData(), fetchSpinHistory()]);
        
        if (data.bucket === "jackpot" || data.bucket === "big") {
          setShowCelebration(true);
          createConfetti();
        }
        
        setSpinning(false);
      }, 4500);

    } catch (error) {
      console.error("Spin failed:", error);
      setSpinning(false);
    }
  }

  const handleConvertPoints = async () => {
    const points = parseInt(convertAmount);
    
    if (isNaN(points) || points < MIN_POINTS_CONVERT) {
      alert(`Minimum points to convert is ${MIN_POINTS_CONVERT.toLocaleString()}`);
      return;
    }

    if (points % POINTS_TO_FIAT_RATE !== 0) {
      alert(`Points must be divisible by ${POINTS_TO_FIAT_RATE}`);
      return;
    }

    if (points > wallet.pointsBalance) {
      alert("Insufficient points balance");
      return;
    }

    setConverting(true);
    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ points }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Conversion failed");
      }

      alert(`✅ Successfully converted ${points.toLocaleString()} points to KSH ${(points / POINTS_TO_FIAT_RATE).toLocaleString()}`);
      setShowConvertModal(false);
      await fetchWalletData();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setConverting(false);
    }
  };

  // Helper Functions
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const getLevelColor = (level: string) => {
    switch(level?.toLowerCase()) {
      case 'bronze': return 'bg-gradient-to-br from-amber-600 to-amber-800';
      case 'silver': return 'bg-gradient-to-br from-gray-400 to-gray-600';
      case 'gold': return 'bg-gradient-to-br from-yellow-500 to-yellow-700';
      case 'platinum': return 'bg-gradient-to-br from-cyan-500 to-blue-600';
      default: return 'bg-gradient-to-br from-gray-600 to-gray-800';
    }
  };

  const getLevelSpins = (level: string) => {
    switch(level?.toLowerCase()) {
      case 'bronze': return 3;
      case 'silver': return 5;
      case 'gold': return 7;
      case 'platinum': return 10;
      default: return 3;
    }
  };

  // Responsive Wheel Size
  const wheelSize = {
    mobile: "w-64 h-64",
    tablet: "md:w-80 md:h-80",
    desktop: "lg:w-96 lg:h-96"
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 p-3 md:p-4 lg:p-8 flex flex-col items-center justify-start">
      {/* Confetti Particles */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {confettiParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute ${particle.shape === 'circle' ? 'rounded-full' : 'rounded-sm'}`}
            style={{
              left: `${particle.x}vw`,
              backgroundColor: particle.color,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              rotate: `${particle.rotation}deg`,
            }}
            initial={{ y: particle.y, opacity: 1 }}
            animate={{
              y: "100vh",
              x: `${Math.random() * 200 - 100}px`,
              rotate: particle.rotation + 1080,
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 2 + Math.random() * 2, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Celebration Effect */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-amber-500/10 to-orange-500/10 backdrop-blur-sm" />
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-16 h-16 md:w-24 md:h-24"
                initial={{ rotate: i * 30, scale: 0 }}
                animate={{ scale: [0, 1, 0] }}
                transition={{ duration: 1.5, delay: i * 0.08 }}
              >
                <Sparkles className="w-full h-full text-yellow-400" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Convert Points Modal */}
      <AnimatePresence>
        {showConvertModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowConvertModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-cyan-500/30 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
                  Convert Points to Cash
                </h3>
                <button
                  onClick={() => setShowConvertModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-cyan-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Your Points</span>
                    <span className="text-lg font-bold text-cyan-400">
                      {formatNumber(wallet.pointsBalance)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Exchange Rate</span>
                    <span className="text-sm font-bold text-green-400">
                      10 points = 1 KSH
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Points to Convert (Min: {MIN_POINTS_CONVERT.toLocaleString()})
                  </label>
                  <input
                    type="number"
                    value={convertAmount}
                    onChange={(e) => setConvertAmount(e.target.value)}
                    min={MIN_POINTS_CONVERT}
                    step={POINTS_TO_FIAT_RATE}
                    className="w-full p-3 rounded-lg bg-gray-800/50 border border-cyan-500/30 text-white"
                    placeholder="Enter points amount"
                  />
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">You will receive:</span>
                    <span className="text-xl font-bold text-green-400">
                      KSH {(parseInt(convertAmount) / POINTS_TO_FIAT_RATE).toLocaleString() || "0"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleConvertPoints}
                  disabled={converting || parseInt(convertAmount) > wallet.pointsBalance}
                  className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${
                    converting || parseInt(convertAmount) > wallet.pointsBalance
                      ? "bg-gradient-to-r from-gray-700 to-gray-800 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
                  }`}
                >
                  {converting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </>
                  ) : (
                    "CONVERT NOW"
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Points must be divisible by {POINTS_TO_FIAT_RATE}. Conversion is instant.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header - Responsive */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full max-w-6xl mb-4 md:mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2 md:px-4">
          {/* Logo Section */}
          <div className="flex items-center justify-between md:justify-start gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                <Target className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  DAILY SPIN WHEEL
                </h1>
                <p className="text-xs md:text-sm text-gray-400 hidden md:block">
                  Spin and win amazing rewards every day!
                </p>
              </div>
            </div>
            
            {/* Mobile Only: Quick Stats Toggle */}
            <button
              onClick={() => setShowMobileStats(!showMobileStats)}
              className="md:hidden p-2 rounded-lg bg-gray-800/50 border border-gray-700"
            >
              {showMobileStats ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>

          {/* User Info Section */}
          <div className="flex items-center justify-between md:justify-end gap-3">
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 rounded-lg bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 transition-colors"
              >
                {showBalance ? (
                  <Eye className="w-4 h-4 text-gray-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </button>
              
              {user && (
                <div className={`px-3 py-1.5 rounded-full text-sm font-medium text-white ${getLevelColor(user.level)} border border-gray-700`}>
                  <span className="hidden lg:inline">{user.level?.toUpperCase()}</span>
                  <span className="lg:hidden">{user.level?.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowConvertModal(true)}
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors text-sm flex items-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Convert</span>
            </button>
          </div>
        </div>

        {/* Mobile Stats Bar - Collapsible */}
        <AnimatePresence>
          {showMobileStats && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-2 mt-4 px-2">
                <div className="p-3 rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-cyan-500/20">
                  <p className="text-xs text-gray-400">Spins Left</p>
                  <p className="text-lg font-bold text-cyan-400">{spinsLeft}</p>
                </div>
                
                <div className="p-3 rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-emerald-500/20">
                  <p className="text-xs text-gray-400">Points</p>
                  <p className="text-lg font-bold text-emerald-400">
                    {showBalance ? formatNumber(wallet.pointsBalance) : "••••"}
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-green-500/20">
                  <p className="text-xs text-gray-400">Cash</p>
                  <p className="text-lg font-bold text-green-400">
                    {showBalance ? `KSH ${formatNumber(wallet.fiatBalance)}` : "••••"}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main Content - Responsive Grid */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-start justify-center gap-6 px-2 md:px-4">
        
        {/* Left Sidebar - Desktop Only */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:block lg:w-1/4 space-y-6"
        >
          {/* Wallet Balance Card */}
          <div className="p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-cyan-400" />
                YOUR BALANCE
              </h2>
            </div>

            <div className="space-y-4">
              {/* Points Balance */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600/30 to-blue-600/30 border border-cyan-500/30 flex items-center justify-center">
                      <Coins className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Points Balance</p>
                      <p className="text-2xl font-bold text-white">
                        {showBalance ? formatNumber(wallet.pointsBalance) : "••••"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cash Balance */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600/30 to-emerald-600/30 border border-green-500/30 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Cash Balance</p>
                      <p className="text-2xl font-bold text-white">
                        {showBalance ? `KSH ${formatNumber(wallet.fiatBalance)}` : "••••"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversion Info */}
              <div className="p-3 rounded-lg bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-500/20">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-300">
                    10 Points = 1 KSH • Min {MIN_POINTS_CONVERT.toLocaleString()} points
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Spins Stats Card */}
          <div className="p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">SPIN STATS</h2>
              <RefreshCw className="w-5 h-5 text-cyan-400" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-900/50 to-gray-800/30 border border-cyan-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600/30 to-blue-600/30 border border-cyan-500/30 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Spins Remaining</p>
                    <p className="text-lg font-bold text-white">{spinsLeft}</p>
                  </div>
                </div>
                <div className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-cyan-300">
                  TODAY
                </div>
              </div>

              {user && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600/30 to-violet-600/30 border border-purple-500/30 flex items-center justify-center">
                      <Crown className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Your Level</p>
                      <p className="text-lg font-bold text-white capitalize">{user.level}</p>
                    </div>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 text-purple-300">
                    {getLevelSpins(user.level)} spins/day
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Center Wheel Area */}
        <div className="w-full lg:w-2/4 flex flex-col items-center">
          {/* Wheel Container */}
          <div className={`relative ${wheelSize.mobile} ${wheelSize.tablet} ${wheelSize.desktop} mx-auto`}>
            {/* Pointer */}
            <div className="absolute -top-2 md:-top-3 lg:-top-4 left-1/2 -translate-x-1/2 z-30">
              <motion.div
                animate={spinning ? { scale: [1, 1.3, 1], rotate: [0, 5, -5, 0] } : {}}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="relative"
              >
                <div className="w-0 h-0 border-l-[16px] border-r-[16px] md:border-l-[18px] md:border-r-[18px] lg:border-l-[20px] lg:border-r-[20px] border-b-[24px] md:border-b-[26px] lg:border-b-[30px] border-l-transparent border-r-transparent border-b-cyan-500" />
                <div className="absolute -top-4 md:-top-5 lg:-top-6 left-1/2 -translate-x-1/2 w-1.5 md:w-1.75 lg:w-2 h-4 md:h-5 lg:h-6 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full" />
              </motion.div>
            </div>

            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border-3 md:border-4 border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-blue-500/5" />
            
            {/* Spinning Wheel */}
            <motion.div
              ref={wheelRef}
              className="absolute inset-3 md:inset-4 rounded-full overflow-hidden transition-transform duration-[4500ms] ease-out"
              style={{ transform: `rotate(${rotation}deg)` }}
              animate={nearMiss ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              {/* Segments */}
              {WHEEL_SEGMENTS.map((seg, i) => {
                const segmentRotation = i * SEGMENT_ANGLE;
                const isHighlighted = result && WHEEL_SEGMENTS.findIndex(s => s.type === result.bucket) === i;

                return (
                  <div
                    key={i}
                    className="absolute w-1/2 h-1/2 origin-bottom-right"
                    style={{ transform: `rotate(${segmentRotation}deg)` }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${getSegmentColor(i)} ${
                        isHighlighted ? 'opacity-100 brightness-125' : 'opacity-90'
                      } transition-all duration-700`}
                      style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%)' }}
                    >
                      {/* Segment border */}
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-white/20" />
                      <div className="absolute top-0 right-0 w-0.5 h-full bg-white/20" />
                      
                      {/* Segment Content */}
                      <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 transform -rotate-45">
                        <div className="flex flex-col items-center">
                          <div className="mb-1 p-1 md:p-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                          {getSegmentIcon(seg.type, (typeof window !== "undefined" && window.innerWidth < 768) ? "xs" : "sm")}

                          </div>
                          <span className="text-[9px] md:text-xs font-bold text-white drop-shadow-lg whitespace-nowrap">
                            {seg.label}
                          </span>
                          <span className="text-[8px] md:text-[10px] font-bold text-white/90">
                            {seg.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Center Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-gray-900 to-black border-2 md:border-3 border-cyan-500/50 flex items-center justify-center">
                <motion.div
                  animate={spinning ? { rotate: 360 } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-center"
                >
                  <Zap className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-cyan-400 mx-auto" />
                  <span className="text-[8px] md:text-[10px] font-bold text-white block mt-0.5">SPIN</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Spin Button */}
          <motion.button
            onClick={handleSpin}
            disabled={spinning || spinsLeft <= 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative mt-6 md:mt-8 w-full max-w-xs md:max-w-sm px-6 py-3 md:py-4 rounded-full font-bold text-sm md:text-base lg:text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
              spinning
                ? "bg-gradient-to-r from-cyan-700 to-blue-800 cursor-wait"
                : spinsLeft <= 0
                ? "bg-gradient-to-r from-gray-700 to-gray-800 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95"
            }`}
          >
            {spinning ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>SPINNING...</span>
              </>
            ) : spinsLeft <= 0 ? (
              <>
                <Clock className="w-4 h-4 md:w-5 md:h-5" />
                <span>COME BACK TOMORROW</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">SPIN NOW ({spinsLeft} LEFT)</span>
                <span className="sm:hidden">SPIN ({spinsLeft})</span>
              </>
            )}
          </motion.button>

          {/* Mobile Actions Row */}
          <div className="flex justify-center gap-3 mt-6 w-full max-w-xs md:hidden">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-900/30 border border-gray-700 text-xs flex items-center gap-2"
            >
              <History className="w-3 h-3" />
              History
            </button>
            
            <button
              onClick={() => setShowLevels(!showLevels)}
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-900/30 border border-gray-700 text-xs flex items-center gap-2"
            >
              <Crown className="w-3 h-3" />
              Levels
            </button>
          </div>

          {/* Redemption Progress - All Screens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-xs md:max-w-sm mt-6"
          >
            <div className="p-3 md:p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-cyan-500/20">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Gem className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
                  <span className="text-xs md:text-sm text-gray-300">Redeem Progress</span>
                </div>
                <span className="text-xs text-cyan-300">
                  {Math.min(wallet.pointsBalance, MIN_POINTS_CONVERT).toLocaleString()}/{MIN_POINTS_CONVERT.toLocaleString()}
                </span>
              </div>
              
              <div className="h-1.5 md:h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${redeemProgress}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
              
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-400">
                  {redeemProgress >= 100 ? "🎉 Ready to Convert!" : "Convert points to cash"}
                </span>
                <span className="text-xs font-bold text-cyan-400">
                  {redeemProgress.toFixed(0)}%
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar - Desktop Only */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden lg:block lg:w-1/4 space-y-6"
        >
          {/* Result Display */}
          <AnimatePresence>
            {(result || nearMiss) && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-lg"
              >
                <h2 className="text-xl font-bold text-white mb-4">
                  {nearMiss ? "NEAR MISS!" : "SPIN RESULT"}
                </h2>
                
                {nearMiss && (
                  <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-500/30">
                    <div className="flex items-center gap-2 text-amber-400">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-bold">So close! Almost hit the jackpot!</span>
                    </div>
                  </div>
                )}

                {result && (
                  <>
                    <div className="flex items-center justify-center mb-4">
                      <div className="text-center">
                        <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                          {result.pointsAwarded}
                        </div>
                        <div className="text-sm text-gray-400">POINTS WON</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2">
                        <span className="text-gray-400">Prize Tier</span>
                        <span className="font-bold text-cyan-300">{result.bucket.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center justify-between p-2">
                        <span className="text-gray-400">Spins Left</span>
                        <span className="font-bold text-white">{result.spinsLeft}</span>
                      </div>
                    </div>

                    {(result.bucket === "jackpot" || result.bucket === "big") && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-4 p-3 rounded-xl bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-500/30 flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-bold">BIG WIN! Congratulations!</span>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Level Benefits Card */}
          <div className="p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              LEVEL BENEFITS
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-cyan-600/10 to-blue-600/10">
                <span className="text-gray-300">Bronze Level</span>
                <span className="font-bold text-cyan-300">3 spins/day</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-gray-600/10 to-gray-700/10">
                <span className="text-gray-400">Silver Level</span>
                <span className="font-bold text-gray-300">5 spins/day</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-yellow-600/10 to-yellow-700/10">
                <span className="text-gray-400">Gold Level</span>
                <span className="font-bold text-yellow-300">7 spins/day</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-cyan-600/10 to-blue-600/10">
                <span className="text-gray-400">Platinum Level</span>
                <span className="font-bold text-cyan-300">10 spins/day</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-800/50">
              <p className="text-sm text-gray-400">
                Upgrade your membership level to get more daily spins!
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Bottom Panels */}
      <div className="w-full max-w-6xl px-2 md:px-4 lg:hidden">
        {/* History Panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-purple-500/20">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-purple-400" />
                    Recent Spins
                  </h3>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {spinHistory.length > 0 ? (
                    spinHistory.map((spin, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg bg-gray-900/30"
                      >
                        <div className="flex items-center gap-2">
                          {getSegmentIcon(spin.spinResult || 'small', 'xs')}
                          <span className="text-xs text-gray-300">
                            {new Date(spin.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-cyan-400">
                            +{spin.pointsAwarded}
                          </span>
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-300">
                            {spin.spinResult?.toUpperCase() || 'SMALL'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-400 text-sm">No spins yet today</p>
                      <p className="text-gray-500 text-xs mt-1">Spin the wheel to see history</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Levels Panel */}
        <AnimatePresence>
          {showLevels && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-cyan-500/20">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Crown className="w-4 h-4 text-cyan-400" />
                    Level Benefits
                  </h3>
                  <button
                    onClick={() => setShowLevels(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {['Bronze', 'Silver', 'Gold', 'Platinum'].map((level, index) => (
                    <div key={level} className="text-center">
                      <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-bold ${
                        user?.level?.toLowerCase() === level.toLowerCase()
                          ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400'
                      }`}>
                        {user?.level?.toLowerCase() === level.toLowerCase() ? '✓' : index + 1}
                      </div>
                      <p className="text-xs font-medium text-gray-300">{level.charAt(0)}</p>
                      <p className="text-xs text-gray-500">{[3,5,7,10][index]} spins</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Result Display */}
        <AnimatePresence>
          {(result || nearMiss) && (
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.9 }}
              className="mt-4"
            >
              <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-cyan-500/30">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-lg font-bold text-white">
                    {nearMiss ? "🔥 NEAR MISS!" : "🎯 SPIN RESULT"}
                  </h2>
                  <button
                    onClick={() => { setResult(null); setNearMiss(false); }}
                    className="text-gray-400 hover:text-white"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
                
                {nearMiss && (
                  <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                      <div>
                        <p className="font-bold text-amber-400">So Close!</p>
                        <p className="text-xs text-amber-300">The jackpot was just one slot away!</p>
                      </div>
                    </div>
                  </div>
                )}

                {result && (
                  <>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1">
                        +{result.pointsAwarded}
                      </div>
                      <p className="text-sm text-gray-400">POINTS WON</p>
                      <div className="mt-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 inline-block">
                        <span className="text-sm font-bold text-cyan-300">{result.bucket.toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 rounded-lg bg-gray-800/50">
                        <p className="text-xs text-gray-400">Spins Left</p>
                        <p className="text-lg font-bold text-white">{result.spinsLeft}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-gray-800/50">
                        <p className="text-xs text-gray-400">Total Points</p>
                        <p className="text-lg font-bold text-emerald-400">{formatNumber(wallet.pointsBalance)}</p>
                      </div>
                    </div>

                    {(result.bucket === "jackpot" || result.bucket === "big") && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-3 p-3 rounded-xl bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 flex items-center gap-2"
                      >
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="text-yellow-400 font-bold">BIG WIN! 🎉</span>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="w-full max-w-6xl px-2 md:px-4 mt-6 md:mt-8 text-center">
        <div className="text-xs md:text-sm text-gray-500 space-y-1">
          <p>🎰 Spin resets daily at midnight • 🛡️ Fair and transparent</p>
          <p className="flex items-center justify-center gap-2">
            <Shield className="w-3 h-3" />
            Daily engagement rewards • No guaranteed earnings
          </p>
        </div>
      </div>

      {/* Global CSS */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px) rotate(-1deg); }
          20%, 40%, 60%, 80% { transform: translateX(8px) rotate(1deg); }
        }
        .animate-shake {
          animation: shake 0.8s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </div>
  );
}