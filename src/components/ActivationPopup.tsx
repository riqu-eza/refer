"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Smartphone, Lock, CheckCircle, X } from "lucide-react";

type ActivationPopupProps = {
  user: {
    _id: string;
    phone?: string;
  };
};

export default function ActivationPopup({ user }: ActivationPopupProps) {
  const [phoneNumber, setPhone] = useState(user.phone || "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [activeStep, setActiveStep] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    setIsClient(true);
    
    // Scan animation
    const interval = setInterval(() => {
      setScanProgress(prev => (prev >= 100 ? 0 : prev + 2));
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
useEffect(() => {
  if (activeStep === 3 && msg.includes("sent")) {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/wallet/${user._id}`);
        const data = await res.json();
        if (data.isActivated) {
          setMsg("Payment successful! Account activated.");
          clearInterval(interval);
          // Optionally close the popup after a delay
          setTimeout(() => {
            const popup = document.getElementById('activation-popup');
            if (popup) popup.style.display = 'none';
          }, 1500);
        }
      } catch (err) {
        console.error("Error fetching user status", err);
      }
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }
}, [activeStep, msg, user._id]);

  const handleSubmit = async () => {
    setLoading(true);
    setMsg("");
    setActiveStep(2);

    const res = await fetch("/api/payments/activation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phoneNumber,
        amount: 1,
        userId: user._id,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "Failed");
      setActiveStep(1);
    } else {
      setMsg("Payment request sent! Enter PIN to activate.");
      setActiveStep(3);
    }

    setLoading(false);
  };

  const closePopup = () => {
    // You might want to implement a different closing logic
    // For now, we'll just hide it
    const popup = document.getElementById('activation-popup');
    if (popup) {
      popup.style.display = 'none';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      id="activation-popup"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 98%, rgba(0, 255, 255, 0.1) 99%),
              linear-gradient(0deg, transparent 98%, rgba(0, 255, 255, 0.1) 99%)
            `,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl"
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              ACCOUNT_ACTIVATION
              </h1>
              {/* <p className="text-sm text-cyan-400/70 font-mono">SECURE_PROTOCOL v3.2</p> */}
            </div>
          </div>
          {/* <button
            onClick={closePopup}
            className="p-2 rounded-lg hover:bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button> */}
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  activeStep >= step 
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400' 
                    : 'border-gray-700 text-gray-500'
                }`}>
                  {step === 1 && <Smartphone className="w-5 h-5" />}
                  {step === 2 && <Lock className="w-5 h-5" />}
                  {step === 3 && <CheckCircle className="w-5 h-5" />}
                </div>
                <span className={`text-xs mt-2 font-mono ${
                  activeStep >= step ? 'text-cyan-400' : 'text-gray-500'
                }`}>
                  STEP_{step}
                </span>
              </div>
            ))}
          </div>
          
          {/* Progress Line */}
          <div className="relative h-0.5 bg-gray-800 mt-5 -mx-6">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={{ width: "0%" }}
              animate={{ width: `${((activeStep - 1) / 2) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Step 1: Phone Input */}
          <AnimatePresence mode="wait">
            {activeStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <p className="text-gray-300 mb-2">
                    Activate your account with only <span className="font-bold">99 KSH</span> and you start earning!
                  </p>
                  <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-400 font-mono text-sm">SECURE_TRANSACTION</span>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-mono text-cyan-400 mb-2">
                    MOBILE_NUMBER
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-transparent rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="2547XXXXXXXX"
                      className="relative w-full p-4 bg-gray-900/50 border border-cyan-500/30 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Smartphone className="w-5 h-5 text-cyan-400/50" />
                    </div>
                  </div>
                </div>

                {/* Amount Display */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-600/10 to-blue-600/10 border border-cyan-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">ACTIVATION_FEE</p>
                      <p className="text-2xl font-bold text-cyan-300">KSH 50</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">ACCOUNT_LEVEL</p>
                      <p className="text-lg font-bold text-yellow-400">BROWNZE</p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={loading || phoneNumber.length < 10}
                  className="w-full py-4 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <div className="relative flex items-center justify-center space-x-3">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>INITIALIZING...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        <span>PROCEED_TO_PAYMENT</span>
                      </>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 2: Processing */}
          <AnimatePresence mode="wait">
            {activeStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-6"
              >
                <div className="relative">
                  <div className="w-32 h-32 mx-auto relative">
                    {/* Outer Ring */}
                    <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
                    {/* Inner Ring */}
                    <motion.div
                      className="absolute inset-8 border-4 border-cyan-500 rounded-full border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Center Icon */}
                    <div className="absolute inset-12 flex items-center justify-center">
                      <Lock className="w-12 h-12 text-cyan-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-cyan-300 mb-2">PROCESSING_TRANSACTION</h3>
                  <p className="text-gray-400">Connecting to secure payment gateway...</p>
                </div>

                {/* Scan Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-cyan-400">ENCRYPTION_SCAN</span>
                    <span className="text-cyan-400">{scanProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500"
                      animate={{ width: `${scanProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 3: Success/Error */}
          <AnimatePresence mode="wait">
            {activeStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center space-y-6"
              >
                <div className={`p-6 rounded-2xl ${
                  msg.includes("sent") 
                    ? 'bg-gradient-to-br from-green-600/10 to-emerald-600/10 border border-green-500/30'
                    : 'bg-gradient-to-br from-red-600/10 to-pink-600/10 border border-red-500/30'
                }`}>
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    msg.includes("sent")
                      ? 'bg-gradient-to-br from-green-600/20 to-emerald-600/20'
                      : 'bg-gradient-to-br from-red-600/20 to-pink-600/20'
                  }`}>
                    {msg.includes("sent") ? (
                      <CheckCircle className="w-10 h-10 text-green-400" />
                    ) : (
                      <X className="w-10 h-10 text-red-400" />
                    )}
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 ${
                    msg.includes("sent") ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {msg.includes("sent") ? "TRANSACTION_INITIATED" : "TRANSACTION_FAILED"}
                  </h3>
                  
                  <p className="text-gray-300 mb-4">{msg}</p>
                  
                  <div className="text-sm font-mono text-gray-400 space-y-1">
                    <p>REFERENCE: TX_{Date.now().toString(36).toUpperCase()}</p>
                    <p>TIMESTAMP: {new Date().toLocaleTimeString()}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-400">
                    {msg.includes("sent") 
                      ? "Check your phone and enter your M-PESA PIN to complete activation"
                      : "Please try again or contact support"
                    }
                  </p>
                  
                  <div className="flex space-x-3">
                    {msg.includes("sent") ? (
                      <button
                        onClick={() => {
                          window.location.reload();
                        }}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all"
                      >
                        REFRESH_STATUS
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveStep(1)}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all"
                      >
                        RETRY
                      </button>
                    )}
                    
                   /
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security Badge */}
          <div className="pt-4 border-t border-cyan-500/20">
            <div className="flex items-center justify-center space-x-2 text-xs text-cyan-400/70 font-mono">
              <Shield className="w-3 h-3" />
              <span>END_TO_END_ENCRYPTION </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}