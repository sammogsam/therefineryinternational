"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, Lock, Heart, Quote, Gift, RotateCcw } from "lucide-react";

const cards = [
  {
    type: "title",
    title: "HAPPY BIRTHDAY, MUMMY!",
    subtitle: "A Special Tribute & Celebration",
  },
  {
    type: "text",
    content: "I remember that morning vividly. That morning is still ever fresh in my memory. A day I will never forget.",
  },
  {
    type: "text",
    content: "You were travelling back to Lagos very early in the morning. You were already in the bus when you brought out ₦4,000, counted the money, and gave it to me. You said, “Damilola, go and register for that JAMB. You will write it.”",
  },
  {
    type: "text",
    content: "I remember those holidays I came to spend with you in Lagos. You would always tell me, “Damilola, you can do it. You are not too old. You are still a teenager. You can do this!”",
  },
  {
    type: "text",
    content: "You would tell me, “This course you are doing is not what I want for you. It is medicine! You have the brain. You have everything it takes to do it.”",
  },
  {
    type: "highlight",
    content: "And yes, Mummy, you pushed me! You pushed me beyond the limits I had placed on myself.",
  },
  {
    type: "text",
    content: "I remember you telling Mr. Ayita at Shepherd, “Tell Damilola that he will study medicine. He will do it. He must do it! Help me convince him. Tell him he has the brains to write this JAMB!”",
  },
  {
    type: "highlight",
    content: "And today, Mummy, here I am! By God's grace, I am less than a year away from becoming a medical doctor.",
  },
  {
    type: "text",
    content: "My story, my journey to becoming a medical doctor, will never be complete without you. Never! Never ever!",
  },
  {
    type: "text",
    content: "I am eternally grateful to God for the gift of you. You are more than an aunt to me; you are a mother to me. Whenever I see you, I see my mother. I see a woman whose love, sacrifices, encouragement, and belief in me have helped shape the person I am becoming.",
  },
  {
    type: "text",
    content: "Thank you for being an amazing mother to me. Thank you for believing in me, even when I struggled to believe in myself. Thank you for seeing possibilities where I might have seen limitations. Thank you for pushing me towards a future that I am now so close to embracing.",
  },
  {
    type: "text",
    content: "And beyond my personal journey, thank you for the way you received the vision of The Refinery International. When I shared the vision with you, you received it with love. You gave me words of advice, encouragement, and support. I remember thinking to myself, “Wow! This is indeed a mother!”",
  },
  {
    type: "highlight",
    content: "Thank you for believing in me. Thank you for believing in the vision. Thank you for believing in us. Thank you for being such an amazing mother, not just to me, but to everyone whose life you have touched.",
  },
  {
    type: "prayer",
    content: "Mummy, as you celebrate another year today, my prayer is that the Lord will bless you with long life and prosperity. May He cause you to increase on every side. May everything you lay your hands upon prosper. May you live long in perfect health to eat the fruit of your labour. May you witness the fulfilment of your dreams and enjoy the rewards of every seed you have sown into the lives of others.",
  },
  {
    type: "prayer",
    content: "May the Lord continually strengthen you, preserve you, and surround you with His goodness. May your latter days be greater than your former, and may you never lack reasons to testify to the faithfulness of God.\n\nIn the name of Jesus. Amen!",
  },
  {
    type: "signature_animated",
    title: "Happy birthday, Mummy!",
    author: "From your son, Samuel Mogaji",
  },
  {
    type: "ministry",
    title: "HAPPY BIRTHDAY TO A PRECIOUS GIFT AND A BLESSING TO THE REFINERY INTERNATIONAL! 🎉🧡",
    content: "Today, we celebrate a remarkable woman whose life and support have been a blessing to The Refinery International. We are grateful to God for the gift of your life and for the privilege of having you as part of our story.",
  },
  {
    type: "ministry",
    content: "Thank you for being a blessing to this vision and for your willingness to support what God is doing through The Refinery International. Your contribution to the work of raising children as lights and arrows is deeply appreciated, and we do not take your place in this journey for granted.",
  },
  {
    type: "prayer",
    content: "May you continually experience fresh dimensions of God's grace, wisdom, favour, and power. May your life be a testimony of His faithfulness, and may you enjoy the fulfilment of His promises in every season. May the Lord bless the works of your hands and grant you many more fruitful years in His presence.",
  },
  {
    type: "signature_animated", // Triggers balloons and sparkles on the final card too!
    title: "Happy Birthday!",
    author: "From all of us at The Refinery International",
  },
];

export default function PartnerTributePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim().toLowerCase() === "bosede") {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const restartTribute = () => {
    setCurrentIndex(0);
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.25),rgba(255,255,255,0))]" />
        
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-orange-500/30 bg-slate-900/90 p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/30">
            <Gift className="h-7 w-7" />
          </div>
          
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">
              The Refinery International
            </span>
            <h1 className="text-2xl font-black tracking-tight">A Special Tribute</h1>
            <p className="text-xs text-gray-400">Enter access password to open your birthday card.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setError(false);
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-center tracking-widest"
              />
              {error && (
                <p className="mt-2 text-xs text-red-400 font-medium">Incorrect password. Please try again.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition flex items-center justify-center gap-2"
            >
              <span>Open Tribute</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </main>
    );
  }

  const card = cards[currentIndex];
  const isLastCard = currentIndex === cards.length - 1;

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden select-none">
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-orange-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-amber-600/10 blur-[120px] pointer-events-none" />

      {/* --- BALLOONS & SPARKLES ON BOTH SIDES (Triggers on Samuel's card and The Refinery card) --- */}
      {card.type === "signature_animated" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              initial={{
                opacity: 0,
                y: -20,
                x: i % 2 === 0 ? `${Math.random() * 25}%` : `${75 + Math.random() * 25}%`,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                opacity: [0, 1, 0.8, 0],
                y: ["0vh", "100vh"],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
              className="absolute text-orange-400 font-bold text-xs"
            >
              ✨
            </motion.div>
          ))}

          {[...Array(6)].map((_, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={`balloon-${i}`}
                initial={{
                  y: "110vh",
                  x: isLeft ? `${Math.random() * 15}%` : `${80 + Math.random() * 15}%`,
                  opacity: 0.8,
                }}
                animate={{
                  y: "-20vh",
                  x: isLeft ? `${Math.random() * 15 + 2}%` : `${78 + Math.random() * 15}%`,
                  rotate: [-6, 6, -6],
                }}
                transition={{
                  duration: Math.random() * 4 + 5,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeInOut",
                }}
                className="absolute text-2xl sm:text-3xl filter drop-shadow-[0_5px_15px_rgba(249,115,22,0.3)]"
              >
                🎈
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-4xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-orange-400 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-orange-400">
            The Refinery International
          </span>
        </div>
        <div className="text-xs font-medium text-gray-300 bg-slate-900/80 border border-slate-800 px-4 py-1.5 rounded-full backdrop-blur-md">
          <span className="text-orange-400 font-bold">{currentIndex + 1}</span> / {cards.length}
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-2xl my-auto py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-orange-500/20 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-8 sm:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />

            {card.type === "title" && (
              <div className="space-y-6 py-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-inner">
                  <Heart className="h-7 w-7 fill-orange-400" />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">
                    Special Birthday Celebration
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                    {card.title}
                  </h1>
                </div>
                <p className="text-sm sm:text-base text-gray-400 font-light">{card.subtitle}</p>
              </div>
            )}

            {card.type === "text" && (
              <div className="relative py-6">
                <Quote className="absolute -top-2 left-0 h-8 w-8 text-orange-500/20 rotate-180" />
                <p className="text-base sm:text-xl text-gray-200 leading-relaxed font-normal px-2 sm:px-6">
                  &ldquo;{card.content}&rdquo;
                </p>
                <Quote className="absolute -bottom-2 right-0 h-8 w-8 text-orange-500/20" />
              </div>
            )}

            {card.type === "highlight" && (
              <div className="py-6 space-y-4">
                <div className="mx-auto w-12 h-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <p className="text-lg sm:text-2xl font-bold text-orange-300 leading-snug px-2">
                  {card.content}
                </p>
              </div>
            )}

            {card.type === "prayer" && (
              <div className="space-y-4 py-4 text-left bg-slate-950/60 p-6 sm:p-8 rounded-2xl border border-slate-800/80 shadow-inner">
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 block text-center mb-1">
                  ✨ A Prayer For You
                </span>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed italic">
                  {card.content}
                </p>
              </div>
            )}

            {card.type === "ministry" && (
              <div className="space-y-4 py-4 text-left">
                {card.title && (
                  <h3 className="text-base sm:text-xl font-black text-orange-400 leading-snug text-center">
                    {card.title}
                  </h3>
                )}
                <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                  {card.content}
                </p>
              </div>
            )}

            {card.type === "signature_animated" && (
              <div className="py-8 space-y-3 relative z-30">
                <div className="mx-auto w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 mb-2">
                  <Heart className="h-5 w-5 fill-orange-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{card.title}</h2>
                <p className="text-base font-bold text-orange-400 tracking-wide">{card.author}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <button
          onClick={prevCard}
          disabled={currentIndex === 0}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold transition ${
            currentIndex === 0
              ? "opacity-30 cursor-not-allowed bg-slate-900 text-gray-500"
              : "bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 shadow-md"
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous Card</span>
        </button>

        <div className="hidden md:flex items-center gap-1 max-w-md overflow-x-auto py-2 px-4 bg-slate-900/60 rounded-full border border-slate-800/80">
          {cards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === idx ? "w-8 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" : "w-1.5 bg-slate-700 hover:bg-slate-600"
              }`}
            />
          ))}
        </div>

        {isLastCard ? (
          <button
            onClick={restartTribute}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8 py-3.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Replay Tribute</span>
          </button>
        ) : (
          <button
            onClick={nextCard}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8 py-3.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition"
          >
            <span>Next Card</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </main>
  );
}