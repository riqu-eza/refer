
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
  User
} from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const [balance, setBalance] = useState({ fiat: 0, points: 0 });
  const [isClient, setIsClient] = useState(false);
  const [hologramScan, setHologramScan] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setIsClient(true);
    
    // Hologram scan animation
    const interval = setInterval(() => {
      setHologramScan(prev => (prev >= 100 ? 0 : prev + 5));
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadBalance() {
      if (!user) return;

      const res = await fetch(`/api/wallet/${user._id}`);
      const data = await res.json();
      setBalance({
        fiat: data.fiatBalance,
        points: data.pointsBalance,
      });
      console.log("Wallet data loaded:", data);
    }
    loadBalance();
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
              backgroundSize: '40px 40px'
            }}
          />
        </div>
        
        {/* Floating Particles */}
        {isClient && Array.from({ length: 15 }).map((_, i) => (
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
        {isClient && (
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
        )}

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

        {/* Main Content */}
        <div className="p-4 space-y-6">
          {/* Balance Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm p-6"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 blur-xl opacity-30"></div>
            
            {/* Animated Circuit Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-transparent"></div>
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-transparent"></div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-cyan-400/70 font-mono">DIGITAL_ASSETS</p>
                    <h2 className="text-2xl font-bold text-white">
                      KSH {balance.fiat.toLocaleString()}
                    </h2>
                  </div>
                </div>
                
                {/* Status Indicator */}
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-mono">ACTIVE</span>
                </div>
              </div>

              {/* Points Display */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-cyan-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-mono">ENERGY_POINTS</p>
                    <p className="text-lg font-semibold text-yellow-300">{balance.points}</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-32">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>SYNC</span>
                    <span>{Math.min(100, balance.points / 10)}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-amber-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, balance.points / 10)}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              </div>

              {/* Hologram Scan */}
              {/* <div className="mt-6 pt-4 border-t border-cyan-500/20">
                <div className="flex justify-between text-xs text-cyan-400/70 font-mono">
                  <span>SYSTEM_INTEGRITY_SCAN</span>
                  <span>{hologramScan}%</span>
                </div>
                <div className="h-1 bg-gray-800 rounded-full overflow-hidden mt-1">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500"
                    animate={{ width: `${hologramScan}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div> */}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-4 gap-4"
          >
            <ActionButton 
              label="DEPOSIT" 
              link="/wallet/deposit" 
              icon={<ArrowUpRight className="w-6 h-6" />}
              color="from-green-600/20 to-emerald-600/20"
              border="border-green-500/30"
              iconColor="text-green-400"
            />
            <ActionButton 
              label="WITHDRAW" 
              link="/wallet/withdraw" 
              icon={<ArrowDownRight className="w-6 h-6" />}
              color="from-red-600/20 to-pink-600/20"
              border="border-red-500/30"
              iconColor="text-red-400"
            />
            <ActionButton 
              label="SPIN" 
              link="/spin" 
              icon={<Gift className="w-6 h-6" />}
              color="from-purple-600/20 to-pink-600/20"
              border="border-purple-500/30"
              iconColor="text-purple-400"
            />
            <ActionButton 
              label="TASKS" 
              link="/tasks" 
              icon={<CheckSquare className="w-6 h-6" />}
              color="from-blue-600/20 to-cyan-600/20"
              border="border-blue-500/30"
              iconColor="text-blue-400"
            />
          </motion.div>

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
              <a
                href="/spin"
                className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-bold rounded-lg hover:from-yellow-500 hover:to-amber-500 transition-all group relative overflow-hidden whitespace-nowrap text-sm sm:text-base"
              >
                <span className="relative">SPIN NOW</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </a>
            </div>
          </motion.div>

                   {/* Tasks Section - Mobile Optimized */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3 sm:space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                <div className="w-1.5 h-5 sm:w-2 sm:h-6 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full flex-shrink-0"></div>
                <span className="whitespace-nowrap">MISSION_QUEUE</span>
              </h3>
              <a 
                href="/tasks" 
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono transition-colors whitespace-nowrap flex-shrink-0 ml-2"
              >
                VIEW_ALL →
              </a>
            </div>

            <div className="space-y-2">
              <TaskCard
                title="NEURAL_TRAINING"
                subtitle="Watch YouTube Ad"
                reward="20 POINTS"
                rewardColor="text-cyan-400"
                icon={<div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse flex-shrink-0"></div>}
                mobile
              />
              <TaskCard
                title="DATA_SURVEY"
                subtitle="Take Quick Survey"
                reward="KSH 15"
                rewardColor="text-green-400"
                icon={<div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>}
                mobile
              />
              <TaskCard
                title="APP_TEST"
                subtitle="Download App"
                reward="KSH 30"
                rewardColor="text-purple-400"
                icon={<div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse flex-shrink-0"></div>}
                mobile
              />
            </div>
          </motion.div>

          {/* Referral CTA */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-600/10 to-green-600/10 backdrop-blur-sm p-4 sm:p-6"
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
              <a
                href="/referrals"
                className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-lg hover:from-emerald-500 hover:to-green-500 transition-all group relative overflow-hidden whitespace-nowrap text-sm sm:text-base"
              >
                <span className="relative">INVITE</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-xl border-t border-cyan-500/20 p-4">
          <div className="grid grid-cols-5 gap-2">
            {[
              { label: "HOME", icon: <Sparkles className="w-5 h-5" />, active: true },
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
                <div className={`${activeTab === tab.label ? "text-cyan-400" : "text-gray-400"}`}>
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
      <div className={`p-3 rounded-lg ${color.split(' ')[0]} ${border} mb-2 group-hover:scale-110 transition-transform`}>
        <div className={iconColor}>
          {icon}
        </div>
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
          <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors">{title}</h4>
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
