"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Phone, 
  Mail, 
  Key, 
  Users, 
  Shield, 
  Zap, 
  Award, 
  TrendingUp,
  ChevronRight,
  Copy,
  Check,
  Crown,
  Star,
  Trophy,
  Activity,
  Globe,
  Layers,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useUser } from "@/src/context/UserContext";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [scanProgress, setScanProgress] = useState(0);
const { logout } = useUser();

  useEffect(() => {
    setIsClient(true);
    
    // Scan animation
    const interval = setInterval(() => {
      setScanProgress(prev => (prev >= 100 ? 0 : prev + 5));
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (data.profile) setProfile(data.profile);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
    load();
  }, []);

  const copyReferralCode = () => {
    if (profile?.referralCode) {
      navigator.clipboard.writeText(profile.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center w-full max-w-sm">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 font-mono text-sm mb-4">SCANNING_PROFILE_DATA...</p>
          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-cyan-400 font-mono p-6 border border-cyan-500/30 rounded-2xl bg-gray-900/50 backdrop-blur-sm text-center w-full max-w-sm">
          <Shield className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          [ERROR] PROFILE_DATA_NOT_FOUND
          <div className="mt-4">
            <a href="/dashboard" className="text-cyan-400 hover:text-cyan-300 text-sm font-mono">
              RETURN_TO_DASHBOARD →
            </a>
          </div>
        </div>
      </div>
    );
  }

  const { referralLevels, counts } = profile;
  const referralData = [
    { tier: "TIER_1", count: counts?.tier1 || 0, users: referralLevels?.tier1 || [], color: "from-cyan-500 to-blue-500", icon: <Users className="w-4 h-4" /> },
    { tier: "TIER_2", count: counts?.tier2 || 0, users: referralLevels?.tier2 || [], color: "from-purple-500 to-pink-500", icon: <Layers className="w-4 h-4" /> },
    { tier: "TIER_3", count: counts?.tier3 || 0, users: referralLevels?.tier3 || [], color: "from-yellow-500 to-orange-500", icon: <Globe className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(90deg, transparent 99%, rgba(0, 255, 255, 0.05) 100%),
                linear-gradient(0deg, transparent 99%, rgba(0, 255, 255, 0.05) 100%)
              `,
              backgroundSize: '35px 35px'
            }}
          />
        </div>
      </div>

      <div className="relative">
        {/* Header */}
        <header className="sticky top-0 z-40 p-4 flex items-center justify-between bg-gray-900/80 backdrop-blur-xl border-b border-cyan-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                USER_PROFILE
              </h1>
              <p className="text-xs text-cyan-400/70 font-mono">SYSTEM_ID: {profile._id?.slice(-8) || "UNKNOWN"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
  <a
    href="/dashboard"
    className="p-2 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-colors"
  >
    <ChevronRight className="w-5 h-5 text-cyan-400 rotate-180" />
  </a>

  <button
    onClick={logout}
    className="p-2 rounded-lg border border-red-500/20 hover:border-red-500/40 transition-colors"
    title="Logout"
  >
    <LogOut className="w-5 h-5 text-red-400" />
  </button>
</div>

          
        </header>

        {/* Main Content */}
        <div className="p-4 space-y-4">
          {/* Profile Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm p-4"
          >
            <div className="flex items-start space-x-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-600/30 to-blue-600/30 border border-cyan-500/30 flex items-center justify-center">
                  <User className="w-8 h-8 text-cyan-400" />
                </div>
                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
                  profile.isActivated 
                    ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30" 
                    : "bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30"
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    profile.isActivated ? "bg-green-500" : "bg-yellow-500"
                  }`}></div>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-white truncate">{profile.name || "Anonymous"}</h2>
                  <div className={`px-2 py-1 rounded text-xs font-mono ${
                    profile.isActivated 
                      ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 text-green-400" 
                      : "bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 text-yellow-400"
                  }`}>
                    {profile.isActivated ? "ACTIVATED" : "PENDING"}
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-cyan-400/70" />
                    <span className="text-sm text-gray-300">{profile.phone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-cyan-400/70" />
                    <span className="text-sm text-gray-300 truncate">{profile.email || "EMAIL_NOT_SET"}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <Key className="w-3.5 h-3.5 text-cyan-400/70" />
                      <span className="text-xs font-mono text-cyan-400">{profile.referralCode}</span>
                    </div>
                    <button
                      onClick={copyReferralCode}
                      className="px-2 py-1 rounded text-xs bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all flex items-center space-x-1"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? "COPIED" : "COPY"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Referrer Info */}
            {profile.referredBy && (
              <div className="mt-3 pt-3 border-t border-cyan-500/20">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-gray-400">REFERRED_BY:</span>
                  <span className="text-sm text-purple-300">{profile.referredBy}</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="p-3 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-gray-900/50 to-gray-900/20 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-1">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-400 font-mono">LEVEL</span>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-bold text-yellow-300">{profile.level || 1}</span>
                <span className="text-xs text-yellow-400/70">XP: {profile.xp || 0}</span>
              </div>
            </div>
            
            <div className="p-3 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-gray-900/50 to-gray-900/20 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-1">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-gray-400 font-mono">NETWORK</span>
              </div>
              <div className="text-xl font-bold text-cyan-300">
                {(counts?.tier1 || 0) + (counts?.tier2 || 0) + (counts?.tier3 || 0)}
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex space-x-1 p-1 rounded-xl bg-gray-900/50 border border-cyan-500/20 backdrop-blur-sm"
          >
            {["overview", "referrals", "stats"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg text-xs font-mono transition-all ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400"
                    : "text-gray-400 hover:text-cyan-300"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </motion.div>

          {/* Active Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Referral Network Overview */}
                <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-white flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span>NETWORK_STRUCTURE</span>
                    </h3>
                    <Sparkles className="w-4 h-4 text-cyan-400/50 animate-pulse" />
                  </div>
                  
                  <div className="space-y-3">
                    {referralData.map((item) => (
                      <div key={item.tier} className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-cyan-500/20">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color}/20 border ${item.color.split(' ')[0]}/30 flex items-center justify-center`}>
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-xs font-mono text-gray-400">{item.tier}</p>
                            <p className="text-sm font-bold text-white">{item.count} USERS</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">TOTAL</div>
                          <div className="text-sm font-bold text-cyan-300">{item.count}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Account Status */}
                <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-white flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <span>ACCOUNT_STATUS</span>
                    </h3>
                    <Activity className="w-4 h-4 text-cyan-400/50 animate-pulse" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">ACTIVATION</span>
                      <span className={`text-sm font-mono ${profile.isActivated ? 'text-green-400' : 'text-yellow-400'}`}>
                        {profile.isActivated ? "COMPLETE" : "PENDING"}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">SECURITY_LEVEL</span>
                      <span className="text-sm font-mono text-cyan-400">ENCRYPTED</span>
                    </div>
                    
                    
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "referrals" && (
              <motion.div
                key="referrals"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {referralData.map((item) => (
                  <div key={item.tier} className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm p-4">
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
                        <p className="text-sm text-gray-500">NO_{item.tier}_USERS_FOUND</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {item.users.map((user: any) => (
                          <div key={user._id} className="flex items-center justify-between p-2 rounded-lg bg-gray-900/30 hover:bg-gray-800/50 transition-colors">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center">
                                <User className="w-3 h-3 text-cyan-400" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                <p className="text-xs text-gray-400 truncate">{user.phone}</p>
                              </div>
                            </div>
                            <div className={`px-2 py-0.5 rounded text-xs font-mono ${
                              user.isActivated 
                                ? "bg-green-500/20 text-green-400" 
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}>
                              {user.isActivated ? "ACTIVE" : "PENDING"}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "stats" && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Progress Stats */}
                <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm p-4">
                  <h3 className="text-base font-bold text-white flex items-center space-x-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span>PERFORMANCE_METRICS</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>EXPERIENCE_POINTS</span>
                        <span>{profile.xp || 0}/1000</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (profile.xp || 0) / 10)}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>NETWORK_GROWTH</span>
                        <span>{referralData.reduce((acc, item) => acc + item.count, 0)} users</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, referralData.reduce((acc, item) => acc + item.count, 0) / 20)}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Achievement Badges */}
                <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm p-4">
                  <h3 className="text-base font-bold text-white flex items-center space-x-2 mb-4">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span>ACHIEVEMENTS</span>
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-lg text-center border ${
                      profile.isActivated 
                        ? "border-green-500/30 bg-green-500/10" 
                        : "border-gray-700/50 bg-gray-800/30"
                    }`}>
                      <Crown className={`w-6 h-6 mx-auto mb-2 ${profile.isActivated ? 'text-green-400' : 'text-gray-500'}`} />
                      <p className="text-xs font-mono text-gray-400">ACCOUNT_ACTIVATED</p>
                      <p className="text-sm font-bold text-white mt-1">{profile.isActivated ? "✓ UNLOCKED" : "LOCKED"}</p>
                    </div>
                    
                    <div className="p-3 rounded-lg text-center border border-cyan-500/30 bg-gradient-to-br from-cyan-600/10 to-blue-600/10">
                      <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                      <p className="text-xs font-mono text-gray-400">REFERRAL_MASTER</p>
                      <p className="text-sm font-bold text-white mt-1">{referralData[0].count}+ REFERRALS</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <nav className="sticky bottom-0 bg-gray-900/90 backdrop-blur-xl border-t border-cyan-500/20 p-3">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3 text-cyan-400" />
              <span>PROTECTED_SESSION</span>
            </div>
            <div className="text-cyan-400/70">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}