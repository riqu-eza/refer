"use client";

import ActivationPopup from "@/src/components/ActivationPopup";
import { useUser } from "@/src/context/UserContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Gift,
  CheckSquare,
  Target,
  Users,
  Wallet,
  Sparkles,
  Zap,
  TrendingUp,
  Bell,
  User,
} from "lucide-react";
import Link from "next/link";
import LevelsComponent from "@/src/components/levels";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const [balance, setBalance] = useState({ fiat: 0, points: 0 });
  const [isClient, setIsClient] = useState(false);
  const [hologramScan, setHologramScan] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [referralData, setReferralData] = useState([]);
  useEffect(() => {
    setIsClient(true);

    // Hologram scan animation
    const interval = setInterval(() => {
      setHologramScan((prev) => (prev >= 100 ? 0 : prev + 5));
    }, 100);

    return () => clearInterval(interval);
  }, []);
  // console.log("User data:", user);
  const referralLink = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/register?ref=${
    user?.referralCode ?? ""
  }`;

  useEffect(() => {
    async function loadBalance() {
      if (!user) return;

      const res = await fetch(`/api/wallet/${user._id}`);
      const data = await res.json();
      setBalance({
        fiat: data.fiatBalance ?? 0,
        points: data.pointsBalance ?? 0,
      });
      console.log("Wallet data loaded:", data);
    }
    loadBalance();
  }, [user]);

  // Add to your state

  // Add to your useEffect to load referral data
  useEffect(() => {
    async function loadReferralData() {
      if (!user) return;

      try {
        const res = await fetch(`/api/referrals/${user._id}`);
        const data = await res.json();

        // Format data for display
        const formattedData = [
          {
            tier: "TIER_1",
            count: data.directReferrals?.length || 0,
            users: data.directReferrals || [],
            icon: <Users className="w-4 h-4 text-cyan-400" />,
          },
          {
            tier: "TIER_2",
            count: data.tier2Referrals?.length || 0,
            users: data.tier2Referrals || [],
            icon: <Users className="w-4 h-4 text-emerald-400" />,
          },
          {
            tier: "TIER_3",
            count: data.tier3Referrals?.length || 0,
            users: data.tier3Referrals || [],
            icon: <Users className="w-4 h-4 text-purple-400" />,
          },
        ];

        setReferralData(formattedData);
      } catch (error) {
        console.error("Error loading referral data:", error);
      }
    }

    loadReferralData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 font-mono">LOADING_USER_DATA...</p>
          <div className="mt-4 w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              animate={{ width: ["0%", "100%", "0%"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-cyan-400 font-mono p-6 border border-cyan-500/30 rounded-lg bg-gray-900/50 backdrop-blur-sm">
          [ERROR] USER_NOT_AUTHENTICATED
        </div>
      </div>
    );
  }

  return (
    <>
      {!user.isActivated && <ActivationPopup user={user} />}

      {/* Animated Background */}
      <div className="fixed inset-0 bg-gray-950 overflow-hidden">
        {/* Cyber Grid */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(90deg, transparent 99%, rgba(0, 255, 255, 0.05) 100%),
                linear-gradient(0deg, transparent 99%, rgba(0, 255, 255, 0.05) 100%)
              `,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Floating Particles */}
        {isClient &&
          Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-cyan-400/30 rounded-full"
              initial={{
                x: `${(i * 20) % 100}vw`,
                y: `${(i * 15) % 100}vh`,
              }}
              animate={{
                y: [null, `-${Math.random() * 50 + 50}vh`],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
      </div>

      <div className="relative min-h-screen bg-transparent text-white pb-24">
        {/* Neon Scan Line */}
        {/* {isClient && (
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent z-50"
            initial={{ top: 0 }}
            animate={{ top: "100vh" }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )} */}

        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-40 p-4 flex justify-between items-center bg-gray-900/80 backdrop-blur-xl border-b border-cyan-500/20"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                NEXUS_DASHBOARD
              </h1>
              <p className="text-xs text-cyan-400/70 font-mono">v2.5.1</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
              <Bell className="w-5 h-5 text-cyan-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </button>

            <a href="/profile" className="relative group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center overflow-hidden">
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all"></div>
              </div>
              <div className="absolute -inset-1 bg-cyan-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
          </div>
        </motion.header>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-600/10 to-green-600/10 backdrop-blur-sm p-4 mt-4 sm:p-6"
        >
          {/* Circuit Pattern - Only on larger screens for performance */}
          {!isClient || window.innerWidth >= 768 ? (
            <div className="absolute inset-0 opacity-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-20 h-20 border border-emerald-500 rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    transform: `scale(${Math.random() * 0.5 + 0.5})`,
                  }}
                />
              ))}
            </div>
          ) : null}

          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-lg font-bold text-emerald-300 truncate">
                NETWORK_EXPANSION
              </h3>
              <p className="text-xs sm:text-sm text-emerald-400/70 truncate">
                Amplify your network rewards
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(referralLink);
                // Optional: Add copy confirmation feedback
              }}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-lg hover:from-emerald-500 hover:to-green-500 transition-all group relative overflow-hidden whitespace-nowrap text-sm sm:text-base"
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 transition-transform group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                INVITE
              </span>
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-cyan-300">
                Click to copy
              </span>
            </button>
          </div>
        </motion.div>
        {/* Main Content */}
        <div className="p-4 space-y-6">
          {/* Balance Card */}

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-gray-900/95 to-gray-900/70 backdrop-blur-lg p-4"
          >
            {/* Header */}
            <div className="relative mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-cyan-400" />
                  Financial Dashboard
                </h2>
                <div className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <span className="text-green-400">REALTIME</span>
                </div>
              </div>
            </div>

            {/* Metrics Grid - Vertical Stack */}
            <div className="space-y-3">
              {/* Wallet Balance */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative p-4 rounded-xl bg-gradient-to-r from-gray-900/50 to-gray-800/30 border border-cyan-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600/30 to-blue-600/30 border border-cyan-500/30 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-cyan-400"></div>
                    </div>
                    <div>
                      <p className="text-xs text-cyan-400/70">Wallet Balance</p>
                      <p className="text-lg font-bold text-white">
                        KSH {balance.fiat.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {/* <div className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-300">
                    LIQUID
                  </div> */}
                </div>
              </div>

              {/* Total Earned & Withdrawn - Side by side on mobile */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-600/30 to-green-600/30 border border-emerald-500/30 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      </div>
                      <p className="text-xs text-emerald-400/70">
                        Total Earned
                      </p>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {balance.totalEarned?.toLocaleString() || "0"}
                    </p>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-600/30 to-orange-600/30 border border-amber-500/30 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                      </div>
                      <p className="text-xs text-amber-400/70">Withdrawn</p>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {balance.totalWithdrawn?.toLocaleString() || "0"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Experiences */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative p-4 rounded-xl bg-gradient-to-r from-gray-900/50 to-gray-800/30 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/30 to-violet-600/30 border border-purple-500/30 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-purple-400"></div>
                      </div>
                      <div>
                        <p className="text-xs text-purple-400/70">Expenses</p>
                        <p className="text-lg font-bold text-white">
                          {balance.totalExperiences || "0"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Referral Section */}
          <motion.div
            key="referrals"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Referral Stats Card */}
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-600/10 to-green-600/10 backdrop-blur-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-300">
                      REFERRAL NETWORK
                    </h3>
                    <p className="text-sm text-emerald-400/70">
                      Your network growth
                    </p>
                  </div>
                </div>
                <div className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-emerald-600/20 to-green-600/20 border border-emerald-500/30 text-emerald-400">
                  ACTIVE
                </div>
              </div>

              {/* Referral Link Card */}
              <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-gray-900/50 to-gray-800/30 border border-emerald-500/20">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs text-emerald-400/70 font-mono">
                      REFERRAL_LINK
                    </p>
                    <p className="text-sm text-gray-300 truncate max-w-[200px]">
                      {referralLink}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(referralLink);
                      // Add toast notification here
                    }}
                    className="px-3 py-2 text-xs bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-lg hover:from-emerald-500 hover:to-green-500 transition-all flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    COPY
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Share this link. You earn rewards when referrals activate.
                </p>
              </div>

              {/* Referral Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-emerald-500/20">
                  <p className="text-2xl font-bold text-emerald-300">
                    {referralData.reduce((acc, item) => acc + item.count, 0)}
                  </p>
                  <p className="text-xs text-emerald-400/70">Total</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-emerald-500/20">
                  <p className="text-2xl font-bold text-emerald-300">
                    {referralData[0]?.users.filter((u) => u.isActivated)
                      .length || 0}
                  </p>
                  <p className="text-xs text-emerald-400/70">Active</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-emerald-500/20">
                  <p className="text-2xl font-bold text-emerald-300">
                    {referralData[0]?.users.filter((u) => !u.isActivated)
                      .length || 0}
                  </p>
                  <p className="text-xs text-emerald-400/70">Pending</p>
                </div>
              </div>
            </div>

            {/* Referral Tiers */}
            {/* {referralData.map((item) => (
              <div
                key={item.tier}
                className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    {item.icon}
                    <span>{item.tier}_REFERRALS</span>
                  </h3>
                  <div className="px-2 py-1 rounded text-xs font-mono bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400">
                    {item.count}
                  </div>
                </div>

                {item.users.length === 0 ? (
                  <div className="text-center py-6">
                    <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      NO_{item.tier}_USERS_FOUND
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {item.users.map((user: any) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-2 rounded-lg bg-gray-900/30 hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center">
                            <User className="w-3 h-3 text-cyan-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {user.phone}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`px-2 py-0.5 rounded text-xs font-mono ${
                            user.isActivated
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {user.isActivated ? "ACTIVE" : "PENDING"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))} */}
          </motion.div>
<motion.div>
  <div className="flex items-center justify-between mb-3">
    <LevelsComponent />
  </div>
</motion.div>
          {/* Quick Actions */}

          {/* Daily Spin CTA - Mobile Optimized */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-600/10 to-amber-600/10 backdrop-blur-sm p-4 sm:p-6"
          >
            {/* Anime Sparkles - Mobile responsive */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400/50 animate-pulse" />
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 sm:w-7 sm:h-7 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-lg font-bold text-yellow-300 truncate">
                  DAILY_REWARDS
                </h3>
                <p className="text-xs sm:text-sm text-yellow-400/70 truncate">
                  Claim your energy boost now
                </p>
              </div>
              <Link
                href="/spin"
                className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-bold rounded-lg hover:from-yellow-500 hover:to-amber-500 transition-all group relative overflow-hidden whitespace-nowrap text-sm sm:text-base"
              >
                <span className="relative">SPIN NOW</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </Link>
            </div>
          </motion.div>

          {/* Tasks Section - Mobile Optimized */}

          {/* Referral CTA */}
        </div>

        {/* Navigation Tabs */}
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-xl border-t border-cyan-500/20 p-4">
          <div className="grid grid-cols-5 gap-2">
            {[
              {
                label: "HOME",
                icon: <Sparkles className="w-5 h-5" />,
                active: true,
              },
              { label: "WALLET", icon: <Wallet className="w-5 h-5" /> },
              { label: "SPIN", icon: <Gift className="w-5 h-5" /> },
              { label: "TASKS", icon: <CheckSquare className="w-5 h-5" /> },
              { label: "PROFILE", icon: <User className="w-5 h-5" /> },
            ].map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(tab.label)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all ${
                  activeTab === tab.label
                    ? "text-cyan-400 bg-gradient-to-b from-cyan-500/10 to-transparent"
                    : "text-gray-400 hover:text-cyan-300"
                }`}
              >
                <div
                  className={`${
                    activeTab === tab.label ? "text-cyan-400" : "text-gray-400"
                  }`}
                >
                  {tab.icon}
                </div>
                <span className="text-xs font-mono">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}

function ActionButton({ label, link, icon, color, border, iconColor }: any) {
  return (
    <motion.a
      href={link}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex flex-col items-center p-4 rounded-xl border ${border} bg-gradient-to-b ${color} backdrop-blur-sm transition-all group`}
    >
      <div
        className={`p-3 rounded-lg ${
          color.split(" ")[0]
        } ${border} mb-2 group-hover:scale-110 transition-transform`}
      >
        <div className={iconColor}>{icon}</div>
      </div>
      <p className="text-xs font-mono text-white/90">{label}</p>
      <div className="mt-1 w-4 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.a>
  );
}

function TaskCard({ title, subtitle, reward, rewardColor, icon }: any) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center justify-between p-4 rounded-xl border border-cyan-500/10 bg-gradient-to-r from-gray-900/50 to-gray-900/20 backdrop-blur-sm hover:border-cyan-500/30 transition-all group"
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {icon}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600/10 to-blue-600/10 border border-cyan-500/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
        <div>
          <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors">
            {title}
          </h4>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-bold ${rewardColor}`}>{reward}</p>
        <span className="text-xs text-cyan-400 font-mono group-hover:text-cyan-300 transition-colors">
          EXECUTE →
        </span>
      </div>
    </motion.div>
  );
}
