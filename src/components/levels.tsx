"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Star,
  Zap,
  Award,
  Crown,
  Trophy,
  ChevronDown,
  CheckCircle,
  Lock,
  Sparkles,
  DollarSign,
  Users,
  Gift,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { LevelId, LEVEL_CONFIG } from "../config/levels";

const ResponsiveLevelsComponent = () => {
  const [activeLevel, setActiveLevel] = useState<LevelId | null>(null);
  const [processing, setProcessing] = useState<LevelId | null>(null);
  const [levels, setLevels] = useState<any[]>([]);
  
  const { user, refreshUser } = useUser();

  // Base level configuration
  const BASE_LEVELS = [
    {
      id: "bronze",
      name: "BRONZE",
      description: "Entry Level",
      status: "locked",
      amount: 99,
      color: "from-amber-600 to-amber-800",
      borderColor: "border-amber-500/40",
      bgColor: "from-amber-600/10 to-amber-800/5",
      icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-400" />,
      benefits: [
        { icon: <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />, text: "Basic earning rate" },
        { icon: <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />, text: "Access to daily spin" },
        { icon: <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />, text: "Direct referral rewards" },
        { icon: <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />, text: "Basic support" },
      ],
    },
    {
      id: "silver",
      name: "SILVER",
      description: "Premium Access",
      status: "locked",
      amount: 249,
      color: "from-gray-400 to-gray-600",
      borderColor: "border-gray-400/40",
      bgColor: "from-gray-400/10 to-gray-600/5",
      icon: <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-300" />,
      benefits: [
        { icon: <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />, text: "20% higher earning rate" },
        { icon: <Users className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />, text: "Tier 2 referral rewards" },
        { icon: <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />, text: "Weekly bonus rewards" },
        { icon: <Gift className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />, text: "Priority support" },
        { icon: <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />, text: "Exclusive tasks access" },
      ],
    },
    {
      id: "gold",
      name: "GOLD",
      description: "Elite Status",
      status: "locked",
      amount: 499,
      color: "from-yellow-500 to-yellow-700",
      borderColor: "border-yellow-500/40",
      bgColor: "from-yellow-500/10 to-yellow-700/5",
      icon: <Crown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400" />,
      benefits: [
        { icon: <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />, text: "50% higher earning rate" },
        { icon: <Users className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />, text: "Tier 3 referral rewards" },
        { icon: <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />, text: "Daily bonus rewards" },
        { icon: <Gift className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />, text: "VIP support 24/7" },
        { icon: <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />, text: "Premium tasks access" },
        { icon: <Award className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />, text: "Early access to features" },
      ],
    },
    {
      id: "platinum",
      name: "PLATINUM",
      description: "Ultimate Tier",
      status: "locked",
      amount: 999,
      color: "from-cyan-500 to-blue-600",
      borderColor: "border-cyan-500/40",
      bgColor: "from-cyan-500/10 to-blue-600/5",
      icon: <Trophy className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-cyan-400" />,
      benefits: [
        { icon: <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />, text: "100% higher earning rate" },
        { icon: <Users className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />, text: "Unlimited tier referrals" },
        { icon: <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />, text: "Hourly bonus rewards" },
        { icon: <Gift className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />, text: "Dedicated account manager" },
        { icon: <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />, text: "All tasks unlocked" },
        { icon: <Award className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />, text: "Founder status" },
        { icon: <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />, text: "Maximum withdrawal limits" },
      ],
    },
  ];

  // Update levels status based on user's current level
  useEffect(() => {
    if (!user) return;

    const userLevelOrder = LEVEL_CONFIG[user.level as LevelId]?.level || 0;
    
    const updatedLevels = BASE_LEVELS.map((level) => {
      const levelOrder = LEVEL_CONFIG[level.id as LevelId]?.level || 0;
      let status = "locked";
      
      if (levelOrder <= userLevelOrder) {
        status = "active";
      } else if (levelOrder === userLevelOrder + 1) {
        status = "available";
      }
      
      return {
        ...level,
        status,
      };
    });

    setLevels(updatedLevels);
  }, [user]);

  const handleUpgrade = async (levelId: LevelId) => {
    try {
      setProcessing(levelId);

      if (!user) {
        throw new Error("Not authenticated");
      }

      const currentLevelOrder = LEVEL_CONFIG[user.level as LevelId].level;
      const targetLevelOrder = LEVEL_CONFIG[levelId].level;

      // 🚫 Prevent downgrade or same-level upgrade
      if (targetLevelOrder <= currentLevelOrder) {
        throw new Error("You already have this level or higher");
      }

      const res = await fetch("/api/payments/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          targetLevel: levelId,
          phoneNumber: user.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upgrade failed");
      }

      // Show success message
      alert("STK Push sent. Complete payment on your phone.");
      
      // Poll for user update
      setTimeout(async () => {
        try {
          await refreshUser();
          alert("Upgrade successful! Your account has been updated.");
        } catch (err) {
          console.error("Failed to refresh user:", err);
          alert("Payment may have been successful. Please refresh the page.");
        }
      }, 5000);

    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleLevelClick = (levelId: LevelId) => {
    setActiveLevel(activeLevel === levelId ? null : levelId);
  };

  const calculateProgress = () => {
    if (!user) return "25%";
    const userLevel = user.level as LevelId;
    const totalLevels = Object.keys(LEVEL_CONFIG).length;
    const currentLevelOrder = LEVEL_CONFIG[userLevel]?.level || 0;
    
    // Calculate progress percentage
    const progress = (currentLevelOrder / totalLevels) * 100;
    return `${progress}%`;
  };

  const getActiveLevelName = () => {
    if (!user) return "BRONZE";
    // Use the user's level key directly (e.g. "bronze") and uppercase it,
    // avoiding access to a non-existent `name` property on LEVEL_CONFIG.
    const levelKey = (user as any).level as LevelId;
    return levelKey ? levelKey.toUpperCase() : "BRONZE";
  };

  // Don't render if levels aren't loaded
  if (levels.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-gray-900/95 to-gray-900/70 backdrop-blur-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-gray-900/95 to-gray-900/70 backdrop-blur-lg p-4 sm:p-5 md:p-6">
      {/* Responsive Header */}
      <div className="relative mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-cyan-600/30 to-blue-600/30 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                MEMBERSHIP LEVELS
              </h2>
              <p className="text-sm sm:text-base text-cyan-400/70 truncate">
                Upgrade to unlock premium benefits
              </p>
            </div>
          </div>
          <div className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 whitespace-nowrap">
            <span className="text-green-400">
              {levels.length} TIERS • {getActiveLevelName()} ACTIVE
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-1">
            <span>Bronze</span>
            <span>Platinum</span>
          </div>
          <div className="h-1.5 sm:h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={{ width: "0%" }}
              animate={{ width: calculateProgress() }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>

      {/* Responsive Levels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {levels.map((level) => (
          <div key={level.id} className="space-y-2">
            {/* Responsive Level Card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleLevelClick(level.id)}
              className={`relative overflow-hidden rounded-xl border ${
                level.borderColor
              } bg-gradient-to-br ${
                level.bgColor
              } backdrop-blur-sm p-3 sm:p-4 cursor-pointer transition-all ${
                level.status === "active" ? "ring-1 ring-amber-500/30" : ""
              } ${
                level.status === "available" ? "ring-1 ring-cyan-500/30 animate-pulse" : ""
              }`}
            >
              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left Section - Icon and Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${level.color} border ${level.borderColor} flex items-center justify-center flex-shrink-0`}
                  >
                    {level.icon}
                    {level.status === "active" && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                      <h3 className="text-base sm:text-lg font-bold text-white truncate">
                        {level.name}
                      </h3>
                      {level.status === "active" && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 whitespace-nowrap">
                          ACTIVE
                        </span>
                      )}
                      {level.status === "available" && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 whitespace-nowrap">
                          AVAILABLE
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">{level.description}</p>
                  </div>
                </div>

                {/* Right Section - Price and Action */}
                <div className="flex flex-col sm:items-end gap-2">
                  <div className="text-right">
                    {level.amount > 0 ? (
                      <>
                        <p className="text-xs text-gray-400 hidden sm:block">Activation Fee</p>
                        <p className="text-lg sm:text-xl font-bold text-white">
                          KSH {level.amount.toLocaleString()}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs sm:text-sm text-green-400">FREE</p>
                        <p className="text-sm text-gray-300 hidden sm:block">On Signup</p>
                      </>
                    )}
                  </div>

                  <div className="flex sm:flex-col gap-2">
                    {level.status === "locked" || level.status === "available" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpgrade(level.id as LevelId);
                        }}
                        disabled={processing === level.id}
                        className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none min-w-[120px] ${
                          processing === level.id
                            ? "bg-gradient-to-r from-gray-600 to-gray-700 cursor-wait"
                            : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                        }`}
                      >
                        {processing === level.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="hidden sm:inline">PROCESSING...</span>
                            <span className="sm:hidden">...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span className="hidden sm:inline">
                              {level.status === "available" ? "UPGRADE NOW" : "UPGRADE"}
                            </span>
                            <span className="sm:hidden">ACTIVATE</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400 hidden sm:inline">
                          ACTIVATED
                        </span>
                        <span className="text-sm font-medium text-green-400 sm:hidden">
                          ✓
                        </span>
                      </div>
                    )}

                    {/* Chevron for mobile */}
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform sm:hidden ${
                        activeLevel === level.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Chevron for desktop */}
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform hidden sm:block ${
                    activeLevel === level.id ? "rotate-180" : ""
                  }`}
                />
              </div>
            </motion.div>

            {/* Responsive Benefits Dropdown */}
            <AnimatePresence>
              {activeLevel === level.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-cyan-500/20">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <h4 className="text-sm sm:text-base font-bold text-cyan-400">
                        LEVEL BENEFITS
                      </h4>
                      <div className="text-xs sm:text-sm px-2 py-1 rounded bg-cyan-500/10 text-cyan-300 whitespace-nowrap">
                        {level.benefits.length} FEATURES
                      </div>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {level.benefits.map((benefit: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-gray-800/30 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                            {benefit.icon}
                          </div>
                          <span className="text-sm text-gray-300 flex-1">
                            {benefit.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {(level.status === "locked" || level.status === "available") && (
                      <div className="mt-4 pt-3 sm:pt-4 border-t border-gray-800/50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="text-sm text-gray-400">
                            {level.status === "available" 
                              ? "Ready to upgrade! This is your next level."
                              : "Upgrade now to unlock these benefits"}
                          </div>
                          <button
                            onClick={() => handleUpgrade(level.id as LevelId)}
                            disabled={processing === level.id}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 min-w-[180px] ${
                              processing === level.id
                                ? "bg-gradient-to-r from-gray-600 to-gray-700 cursor-wait"
                                : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                            }`}
                          >
                            {processing === level.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>PROCESSING...</span>
                              </>
                            ) : (
                              <>
                                <DollarSign className="w-4 h-4" />
                                <span>PAY KSH {level.amount}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Responsive Footer */}
      <div className="mt-6 pt-4 border-t border-gray-800/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <span className="text-sm text-gray-400">
              Higher levels = Better earnings
            </span>
          </div>
          
          {/* Quick Level Overview */}
          <div className="flex items-center justify-between sm:justify-end gap-4">
            {levels.map((level, idx) => (
              <div key={level.id} className="text-center">
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                    level.status === "active"
                      ? "bg-gradient-to-br from-green-500 to-emerald-600"
                      : level.status === "available"
                      ? "bg-gradient-to-br from-cyan-500 to-blue-600 animate-pulse"
                      : "bg-gradient-to-br from-gray-700 to-gray-800"
                  }`}
                >
                  {level.status === "active" ? (
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  ) : (
                    <span className="text-xs font-bold text-gray-400">
                      {idx + 1}
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-white hidden sm:block">
                  {level.name}
                </p>
                <p className="text-xs font-medium text-white sm:hidden">
                  {level.name.slice(0, 1)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveLevelsComponent;