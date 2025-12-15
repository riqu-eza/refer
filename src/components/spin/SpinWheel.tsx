"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Gift, 
  Coins, 
  RotateCw, 
  Sparkles, 
  Target,
  Trophy,
  AlertCircle,
  Clock,
  Crown,
  ChevronRight,
  Circle,
  Volume2,
  Award,
  Star,
  ChevronDown,
  Check
} from "lucide-react";

type SpinResult = {
  key: string;
  type: "POINTS" | "FIAT" | "SPIN" | "NONE";
  value: number;
};

type WheelSection = {
  label: string;
  color: string;
  icon: React.ReactNode;
  value: number;
  gradient: string;
  border: string;
  textColor: string;
};

export default function SpinWheel() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<SpinResult | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [energy, setEnergy] = useState(100);
  const [wheelGlow, setWheelGlow] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [winningSection, setWinningSection] = useState<number | null>(null);
  const [showTargetMarker, setShowTargetMarker] = useState(false);
  const [predictedSection, setPredictedSection] = useState<number | null>(null);
  
  const wheelRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const targetRotationRef = useRef<number>(0);

  useEffect(() => {
    setIsClient(true);
    
    // Energy recharge simulation
    const interval = setInterval(() => {
      setEnergy(prev => Math.min(100, prev + 0.5));
    }, 1000);
    
    return () => {
      clearInterval(interval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Wheel sections data with enhanced styling
  const wheelSections: WheelSection[] = [
    { 
      label: "50 POINTS", 
      color: "from-cyan-500 to-blue-500",
      gradient: "bg-gradient-to-br from-cyan-500/30 to-blue-500/30",
      border: "border-cyan-500/50",
      textColor: "text-cyan-300",
      icon: <Zap className="w-5 h-5" />, 
      value: 50 
    },
    { 
      label: "KSH 20", 
      color: "from-green-500 to-emerald-500",
      gradient: "bg-gradient-to-br from-green-500/30 to-emerald-500/30",
      border: "border-green-500/50",
      textColor: "text-green-300",
      icon: <Coins className="w-5 h-5" />, 
      value: 20 
    },
    { 
      label: "BONUS SPIN", 
      color: "from-purple-500 to-pink-500",
      gradient: "bg-gradient-to-br from-purple-500/30 to-pink-500/30",
      border: "border-purple-500/50",
      textColor: "text-purple-300",
      icon: <Gift className="w-5 h-5" />, 
      value: 1 
    },
    { 
      label: "100 POINTS", 
      color: "from-yellow-500 to-amber-500",
      gradient: "bg-gradient-to-br from-yellow-500/30 to-amber-500/30",
      border: "border-yellow-500/50",
      textColor: "text-yellow-300",
      icon: <Zap className="w-5 h-5" />, 
      value: 100 
    },
    { 
      label: "JACKPOT", 
      color: "from-red-500 to-orange-500",
      gradient: "bg-gradient-to-br from-red-500/30 to-orange-500/30",
      border: "border-red-500/50",
      textColor: "text-red-300",
      icon: <Crown className="w-5 h-5" />, 
      value: 200 
    },
    { 
      label: "KSH 50", 
      color: "from-emerald-500 to-green-500",
      gradient: "bg-gradient-to-br from-emerald-500/30 to-green-500/30",
      border: "border-emerald-500/50",
      textColor: "text-emerald-300",
      icon: <Coins className="w-5 h-5" />, 
      value: 50 
    },
    { 
      label: "FREE SPIN", 
      color: "from-blue-500 to-cyan-500",
      gradient: "bg-gradient-to-br from-blue-500/30 to-cyan-500/30",
      border: "border-blue-500/50",
      textColor: "text-blue-300",
      icon: <RotateCw className="w-5 h-5" />, 
      value: 1 
    },
    { 
      label: "25 POINTS", 
      color: "from-pink-500 to-purple-500",
      gradient: "bg-gradient-to-br from-pink-500/30 to-purple-500/30",
      border: "border-pink-500/50",
      textColor: "text-pink-300",
      icon: <Zap className="w-5 h-5" />, 
      value: 25 
    },
  ];

  // Physics-based animation
  const animateSpin = (startTime: number, duration: number, startRotation: number, targetRotation: number, winningIndex: number) => {
    targetRotationRef.current = targetRotation;
    setWinningSection(winningIndex);
    setShowTargetMarker(true);

    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for realistic deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      // Calculate current rotation with easing
      const currentRotation = startRotation + (targetRotation - startRotation) * easeOut;
      setRotation(currentRotation);

      // Calculate velocity for visual feedback
      const currentVelocity = ((targetRotation - startRotation) / duration) * (1 - progress);
      setVelocity(Math.abs(currentVelocity));

      // Predict which section we're heading towards during slowdown
      if (progress > 0.7) {
        const currentDeg = (currentRotation % 360 + 360) % 360;
        const predicted = Math.floor((360 - currentDeg + 22.5) % 360 / 45);
        setPredictedSection(predicted);
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Spin complete
        setSpinning(false);
        setWheelGlow(false);
        setVelocity(0);
        setPredictedSection(winningIndex);
        
        // Show result after slight delay
        setTimeout(() => {
          if (result) {
            triggerConfetti();
          }
        }, 500);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const triggerConfetti = () => {
    if (!isClient) return;
    
    const confettiCount = 80;
    const colors = ['#00ffff', '#00ffaa', '#ff00ff', '#ffff00', '#ff5500'];
    
    for (let i = 0; i < confettiCount; i++) {
      createConfettiParticle();
    }

    function createConfettiParticle() {
      const confetti = document.createElement('div');
      confetti.className = 'fixed w-2 h-2 rounded-sm z-50';
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.top = '-20px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.opacity = '0.8';
      document.body.appendChild(confetti);

      const animation = confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
      ], {
        duration: Math.random() * 2000 + 1000,
        easing: 'cubic-bezier(0.1, 0.2, 0.8, 0.9)'
      });

      animation.onfinish = () => confetti.remove();
    }
  };

  async function handleSpin() {
    console.log("Spin button clicked");
    if (spinning || energy < 25) return;

    setSpinning(true);
    setResult(null);
    setWheelGlow(true);
    setPredictedSection(null);
    setShowTargetMarker(false);

    // Play spin sound
    if (soundOn && typeof window !== 'undefined') {
      const spinSound = new Audio('/sounds/spin.mp3');
      spinSound.volume = 0.3;
      spinSound.play().catch(() => {});
    }

    const res = await fetch("/api/spin", { method: "POST" });
    if (!res.ok) {
      setSpinning(false);
      setWheelGlow(false);
      return;
    }

    const data = await res.json();
    const slotIndex: number = data.slotIndex;
    const degreesPerSlot = 360 / 8;

    // Multiple spins + land on backend-decided slot
    const targetRotation = rotation + 360 * 8 + (8 - slotIndex) * degreesPerSlot;
    setRemaining(data.remainingSpins);
    setEnergy(prev => Math.max(0, prev - 25));
    setResult(data.reward);

    // Start physics-based animation
    lastTimeRef.current = performance.now();
    animateSpin(performance.now(), 5000, rotation, targetRotation, slotIndex);
  }

  // Calculate which section is currently at the pointer
  const getCurrentSection = () => {
    const normalizedRotation = (rotation % 360 + 360) % 360;
    const sectionIndex = Math.floor((360 - normalizedRotation + 22.5) % 360 / 45);
    return sectionIndex;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(0, 255, 255, 0.1) 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, rgba(255, 191, 0, 0.1) 2px, transparent 2px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Animated rings */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border border-cyan-500/10 rounded-full"
            style={{ margin: `${(i + 1) * 30}px` }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20 + i * 10, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <div className="relative">
        {/* Header */}
        <header className="sticky top-0 z-40 p-4 flex items-center justify-between bg-gray-900/80 backdrop-blur-xl border-b border-cyan-500/20">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center"
            >
              <Gift className="w-5 h-5" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                VISUAL_SPIN
              </h1>
              <p className="text-xs text-yellow-400/70 font-mono">SEE_THE_WIN</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSoundOn(!soundOn)}
              className={`p-2 rounded-lg border transition-colors ${
                soundOn 
                  ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400" 
                  : "border-gray-600/40 bg-gray-800/30 text-gray-400"
              }`}
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <a href="/dashboard" className="p-2 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
              <ChevronRight className="w-5 h-5 text-cyan-400 rotate-180" />
            </a>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-4 space-y-6">
          {/* Current Section Indicator */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-gray-900/90 to-gray-900/50 backdrop-blur-sm p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-mono text-cyan-400">CURRENT_SECTION</span>
              </div>
              <div className="text-xs font-mono text-cyan-400">
                {spinning ? "SPINNING..." : "READY"}
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${wheelSections[getCurrentSection()]?.gradient} ${wheelSections[getCurrentSection()]?.border}`}>
                {wheelSections[getCurrentSection()]?.icon}
              </div>
              <div>
                <p className={`text-sm font-bold ${wheelSections[getCurrentSection()]?.textColor}`}>
                  {wheelSections[getCurrentSection()]?.label}
                </p>
                <p className="text-xs text-gray-400">
                  Value: {wheelSections[getCurrentSection()]?.value}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Wheel Container */}
          <div className="flex flex-col items-center">
            {/* Pointer with winning indicator */}
            <div className="relative z-20 mb-6">
              <motion.div
                animate={{ 
                  scale: wheelGlow ? [1, 1.2, 1] : 1,
                  y: spinning ? [0, -5, 0] : 0
                }}
                transition={{ duration: 0.5, repeat: spinning ? Infinity : 0 }}
                className="relative"
              >
                {/* Main pointer */}
                <div className="relative">
                  <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[40px] border-transparent border-b-red-500"></div>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-red-500 rounded-full blur-md"></div>
                </div>
                
                {/* Target marker */}
                {showTargetMarker && winningSection !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-16 left-1/2 -translate-x-1/2"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50 flex items-center justify-center mx-auto mb-2">
                        <Star className="w-6 h-6 text-green-400" />
                      </div>
                      <span className="text-xs font-mono text-green-400 bg-black/50 px-2 py-1 rounded">
                        TARGET: {wheelSections[winningSection]?.label}
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Wheel with visual indicators */}
            <div className="relative">
              {/* Prediction indicator */}
              {predictedSection !== null && spinning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -inset-8 z-10 pointer-events-none"
                >
                  <div className="relative w-full h-full">
                    {/* Line pointing to predicted section */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 w-1 h-32 bg-gradient-to-t from-green-500 to-transparent origin-top"
                      style={{
                        transform: `rotate(${predictedSection * 45 + 22.5}deg) translateY(-50%)`,
                        transformOrigin: 'center bottom'
                      }}
                      animate={{
                        opacity: [0.3, 0.8, 0.3]
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    
                    {/* Prediction label */}
                    <div 
                      className="absolute text-xs font-mono text-green-400 bg-black/70 px-2 py-1 rounded whitespace-nowrap"
                      style={{
                        top: 'calc(50% - 120px)',
                        left: '50%',
                        transform: `rotate(${predictedSection * 45 + 22.5}deg) translateX(-50%)`,
                        transformOrigin: 'center 120px'
                      }}
                    >
                      PREDICTED: {wheelSections[predictedSection]?.label}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Wheel */}
              <motion.div
                ref={wheelRef}
                className="relative w-80 h-80 rounded-full border-4 border-cyan-500/50 overflow-hidden shadow-2xl"
                style={{ transform: `rotate(${rotation}deg)` }}
                animate={spinning ? { 
                  scale: [1, 1.02, 1],
                } : {}}
                transition={{ duration: 0.5, repeat: spinning ? Infinity : 0 }}
              >
                {/* Center hub */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-gray-900 to-black border-4 border-cyan-500/50 flex items-center justify-center z-10">
                  <motion.div
                    animate={{ rotate: spinning ? 360 : 0 }}
                    transition={{ duration: spinning ? 0.5 : 20, repeat: Infinity, ease: "linear" }}
                    className="relative w-24 h-24 rounded-full border-2 border-dashed border-cyan-500/30"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Target className="w-8 h-8 text-yellow-400 mx-auto" />
                        <span className="text-xs font-mono text-cyan-400 mt-1">WIN ZONE</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Wheel sections with enhanced visibility */}
                {wheelSections.map((section, i) => {
                  const isCurrent = getCurrentSection() === i;
                  const isPredicted = predictedSection === i;
                  const isWinning = winningSection === i;
                  
                  return (
                    <motion.div
                      key={i}
                      className="absolute w-1/2 h-1/2 top-1/2 left-1/2 origin-[0%_0%]"
                      style={{
                        transform: `rotate(${i * 45}deg)`,
                      }}
                      animate={
                        isCurrent ? {
                          scale: [1, 1.05, 1],
                          filter: ['brightness(1)', 'brightness(1.8)', 'brightness(1)']
                        } : 
                        isPredicted ? {
                          scale: [1, 1.1, 1],
                          filter: ['brightness(1)', 'brightness(2)', 'brightness(1)']
                        } :
                        isWinning ? {
                          scale: [1, 1.08, 1],
                          boxShadow: [
                            'inset 0 0 0px rgba(0, 255, 0, 0)',
                            'inset 0 0 30px rgba(0, 255, 0, 0.3)',
                            'inset 0 0 0px rgba(0, 255, 0, 0)'
                          ]
                        } : {}
                      }
                      transition={{ duration: 0.5, repeat: spinning ? Infinity : 0 }}
                    >
                      <div 
                        className={`absolute w-full h-full ${section.gradient} border ${section.border} clip-path-triangle transition-all duration-300 ${
                          isCurrent ? 'shadow-[0_0_20px_rgba(0,255,255,0.5)]' :
                          isPredicted ? 'shadow-[0_0_30px_rgba(0,255,0,0.5)]' :
                          isWinning ? 'shadow-[0_0_25px_rgba(255,215,0,0.5)]' : ''
                        }`}
                        style={{
                          transform: `rotate(22.5deg) translateX(-50%)`,
                          transformOrigin: '0% 0%',
                        }}
                      >
                        {/* Section highlight indicators */}
                        {isCurrent && (
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent"></div>
                        )}
                        
                        {isPredicted && (
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-transparent"></div>
                        )}
                        
                        {isWinning && (
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-transparent"></div>
                        )}

                        {/* Section Content */}
                        <div 
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
                          style={{ transform: `rotate(-${i * 45 + 22.5}deg) translateX(100px) rotate(${i * 45 + 22.5}deg)` }}
                        >
                          <motion.div 
                            className={`mb-2 mx-auto w-10 h-10 rounded-full border flex items-center justify-center ${
                              isCurrent ? 'bg-white/30 border-white shadow-lg' :
                              isPredicted ? 'bg-green-500/40 border-green-500 shadow-lg' :
                              isWinning ? 'bg-yellow-500/40 border-yellow-500 shadow-lg' :
                              `bg-gradient-to-br ${section.gradient} ${section.border}`
                            }`}
                            animate={
                              isCurrent ? { rotate: [0, 360] } :
                              isPredicted ? { scale: [1, 1.3, 1] } :
                              isWinning ? { rotate: [0, 10, -10, 0] } : {}
                            }
                            transition={{ duration: 0.5, repeat: spinning ? Infinity : 0 }}
                          >
                            {section.icon}
                          </motion.div>
                          
                          <div className="space-y-1">
                            <span className={`text-xs font-bold ${section.textColor} block whitespace-nowrap ${
                              (isCurrent || isPredicted || isWinning) ? 'text-white' : ''
                            }`}>
                              {section.label}
                            </span>
                            <span className={`text-[10px] font-mono ${
                              (isCurrent || isPredicted || isWinning) ? 'text-white' : 'text-gray-300'
                            }`}>
                              #{i + 1} • {section.value}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Winning zone indicator */}
                {winningSection !== null && (
                  <motion.div
                    className="absolute w-full h-full rounded-full pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: spinning ? 0.3 : 0 }}
                  >
                    <div 
                      className="absolute top-1/2 left-1/2 w-1 h-1/2 bg-gradient-to-t from-green-500 to-transparent origin-top"
                      style={{
                        transform: `rotate(${winningSection * 45 + 22.5}deg) translateY(-50%)`,
                        transformOrigin: 'center bottom'
                      }}
                    />
                  </motion.div>
                )}
              </motion.div>

              {/* Section numbers around wheel */}
              <div className="absolute inset-0 pointer-events-none">
                {wheelSections.map((_, i) => (
                  <div
                    key={`number-${i}`}
                    className="absolute text-xs font-mono text-gray-500"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${i * 45}deg) translateX(170px) rotate(-${i * 45}deg)`,
                    }}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Section Legend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 w-full max-w-md"
            >
              <div className="grid grid-cols-4 gap-2">
                {wheelSections.slice(0, 4).map((section, i) => (
                  <div 
                    key={i}
                    className={`p-2 rounded-lg text-center ${section.gradient} ${section.border}`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      {section.icon}
                    </div>
                    <span className="text-[10px] font-bold text-white truncate block">
                      {section.label.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Spin Button */}
            <motion.button
              onClick={handleSpin}
              disabled={spinning || energy < 25}
              whileHover={{ scale: energy >= 25 && !spinning ? 1.05 : 1 }}
              whileTap={{ scale: energy >= 25 && !spinning ? 0.95 : 1 }}
              className={`relative mt-8 px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                spinning 
                  ? "bg-gradient-to-r from-gray-700 to-gray-800 cursor-not-allowed" 
                  : energy < 25
                  ? "bg-gradient-to-r from-gray-800 to-gray-900 cursor-not-allowed"
                  : "bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-600 hover:shadow-[0_0_30px_rgba(255,191,0,0.5)]"
              }`}
            >
              <div className="relative flex items-center justify-center space-x-3">
                {spinning ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                    >
                      <RotateCw className="w-6 h-6" />
                    </motion.div>
                    <span className="text-base">WHEEL_SPINNING</span>
                  </>
                ) : energy < 25 ? (
                  <>
                    <AlertCircle className="w-6 h-6" />
                    <span className="text-base">NEED_MORE_ENERGY</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    <span className="text-base">SPIN_TO_WIN</span>
                    <ChevronDown className="w-6 h-6" />
                  </>
                )}
              </div>
              
              {/* Energy requirement */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500">
                Requires <span className="text-yellow-400">25 Energy</span>
              </div>
            </motion.button>

            {/* Current Section Info */}
            <motion.div
              animate={{ 
                opacity: spinning ? 0.7 : 1,
                scale: spinning ? 0.95 : 1 
              }}
              className="mt-6 p-3 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-gray-900/50 to-gray-900/20 backdrop-blur-sm"
            >
              <div className="flex items-center justify-center space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${wheelSections[getCurrentSection()]?.gradient} ${wheelSections[getCurrentSection()]?.border}`}>
                  {wheelSections[getCurrentSection()]?.icon}
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white">Currently Pointing At</p>
                  <p className={`text-lg font-bold ${wheelSections[getCurrentSection()]?.textColor}`}>
                    {wheelSections[getCurrentSection()]?.label}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Section</p>
                  <p className="text-lg font-bold text-cyan-400">#{getCurrentSection() + 1}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Prediction Indicator */}
          {predictedSection !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative overflow-hidden rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-600/10 to-emerald-600/10 backdrop-blur-sm p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-mono text-green-400">PREDICTED_WIN</span>
                </div>
                <div className="text-xs font-mono text-green-400">
                  {Math.round((rotation / targetRotationRef.current) * 100)}% COMPLETE
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${wheelSections[predictedSection]?.gradient} ${wheelSections[predictedSection]?.border}`}>
                  {wheelSections[predictedSection]?.icon}
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white">Heading Towards</p>
                  <p className={`text-xl font-bold ${wheelSections[predictedSection]?.textColor}`}>
                    {wheelSections[predictedSection]?.label}
                  </p>
                  <p className="text-xs text-gray-400">
                    Value: {wheelSections[predictedSection]?.value}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Confidence</p>
                  <p className="text-lg font-bold text-green-400">
                    {Math.min(95, Math.round((velocity / 20) * 100))}%
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom Stats */}
        <motion.nav 
          className="sticky bottom-0 bg-gray-900/90 backdrop-blur-xl border-t border-cyan-500/20 p-3"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="grid grid-cols-3 gap-4 text-xs text-center">
            <div>
              <p className="text-gray-400 mb-1">CURRENT_SECTION</p>
              <p className={`font-bold ${wheelSections[getCurrentSection()]?.textColor}`}>
                #{getCurrentSection() + 1}
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">SPIN_SPEED</p>
              <p className="font-bold text-cyan-400">
                {Math.round(velocity)}°/s
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">ENERGY</p>
              <p className="font-bold text-yellow-400">
                {Math.round(energy)}%
              </p>
            </div>
          </div>
        </motion.nav>

        {/* CSS for triangle clip-path */}
        <style jsx>{`
          .clip-path-triangle {
            clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
          }
          
          /* Smooth scrolling */
          html {
            scroll-behavior: smooth;
          }
          
          /* Custom glow effects */
          .glow-effect {
            filter: drop-shadow(0 0 10px currentColor);
          }
        `}</style>
      </div>
    </div>
  );
}