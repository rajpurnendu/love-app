"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

type Particle = {
  left: number;
  size: number;
  duration: number;
  delay?: number;
};

export default function Home() {
  const [celebrate, setCelebrate] = useState(false);
  const [moved, setMoved] = useState(false);
  const [noPosition, setNoPosition] = useState({ top: 200, left: 200 });

  const [hearts, setHearts] = useState<Particle[]>([]);
  const [noCount, setNoCount] = useState(0);
  const [loveLevel, setLoveLevel] = useState(0);

  const noRef = useRef<HTMLButtonElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 💖 generate hearts safely
  const generateHearts = () => {
    if (hearts.length > 0) return;

    const generated = Array.from({ length: 20 }).map(() => ({
      left: Math.random() * 100,
      size: Math.random() * 16 + 12,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 5,
    }));

    setHearts(generated);
  };

  // 😈 smart movement
  const moveNoButton = (x?: number, y?: number) => {
    generateHearts();
    setMoved(true);
    setNoCount((prev) => prev + 1);

    const buttonWidth = 120;
    const buttonHeight = 50;

    const maxX = window.innerWidth - buttonWidth;
    const maxY = window.innerHeight - buttonHeight;

    let newX = Math.random() * maxX;
    let newY = Math.random() * maxY;

    if (x !== undefined && y !== undefined) {
      newX =
        x > window.innerWidth / 2
          ? Math.random() * (maxX / 2)
          : maxX / 2 + Math.random() * (maxX / 2);

      newY =
        y > window.innerHeight / 2
          ? Math.random() * (maxY / 2)
          : maxY / 2 + Math.random() * (maxY / 2);
    }

    const padding = 20;

    newX = Math.max(padding, Math.min(newX, maxX - padding));
    newY = Math.max(padding, Math.min(newY, maxY - padding));

    setNoPosition({
      top: newY,
      left: newX,
    });
  };

  // 🎯 cursor prediction
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!noRef.current || !moved) return;

      const rect = noRef.current.getBoundingClientRect();
      const dist = Math.hypot(
        e.clientX - (rect.left + rect.width / 2),
        e.clientY - (rect.top + rect.height / 2),
      );

      if (dist < 150) moveNoButton(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [moved]);

  // 💓 burst hearts
  const burstHearts = (x: number, y: number) => {
    ["💖", "💕", "💞", "💓"].forEach((emoji) => {
      const el = document.createElement("div");
      el.innerText = emoji;

      Object.assign(el.style, {
        position: "fixed",
        left: `${x}px`,
        top: `${y}px`,
        fontSize: "22px",
        pointerEvents: "none",
        transition: "all 1s ease-out",
        zIndex: 999,
      });

      document.body.appendChild(el);

      setTimeout(() => {
        el.style.transform = `translate(${Math.random() * 200 - 100}px, -150px)`;
        el.style.opacity = "0";
      }, 10);

      setTimeout(() => el.remove(), 1000);
    });
  };

  // 🎵 smooth music
  const playMusic = () => {
    if (!audioRef.current) return;

    audioRef.current.volume = 0;
    audioRef.current.play();

    let v = 0;
    const i = setInterval(() => {
      if (!audioRef.current) return;
      v += 0.05;
      audioRef.current.volume = Math.min(v, 1);
      if (v >= 1) clearInterval(i);
    }, 100);
  };

  // 🎉 YES click
  const handleYes = (e: React.MouseEvent) => {
    setCelebrate(true);
    playMusic();
    burstHearts(e.clientX, e.clientY);

    confetti({
      particleCount: 180,
      spread: 140,
      origin: { y: 0.6 },
    });
  };

  const share = () => {
    const url = window.location.href;
    const text = encodeURIComponent(`Try this 😄👇\n${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-100 to-pink-200 px-4 relative overflow-hidden">
      <audio ref={audioRef} src="/romantic.mp3" loop />

      {/* 💖 background hearts */}
      {!celebrate && (
        <div className="absolute inset-0 pointer-events-none">
          {hearts.map((h, i) => (
            <span
              key={i}
              className="absolute text-pink-400 animate-float"
              style={{
                left: `${h.left}%`,
                bottom: "-20px",
                fontSize: `${h.size}px`,
                animationDuration: `${h.duration}s`,
                animationDelay: `${h.delay}s`,
              }}
            >
              💖
            </span>
          ))}
        </div>
      )}

      {!celebrate ? (
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-8 text-center relative border border-white/40">
          {/* score */}
          <p className="text-xs text-gray-500 mb-2">😈 Attempts: {noCount}</p>

          {/* love meter */}
          <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
            <div
              className="h-2 bg-pink-500 rounded-full transition-all"
              style={{ width: `${loveLevel}%` }}
            />
          </div>

          <p className="text-xs text-gray-600 mb-2 font-medium">
            💖 Love Meter: {loveLevel}%
          </p>

          <h1 className="text-lg md:text-2xl font-semibold mb-6 whitespace-pre-line text-gray-800 leading-relaxed">
            {`Hey… it's Purnendu ❤️  
I think I fell for you 💖  
Will you be mine? 💍`}
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onMouseEnter={() => setLoveLevel((p) => Math.min(p + 10, 100))}
              onClick={handleYes}
              className="w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded-full"
            >
              Yes 💖
            </button>

            {!moved && (
              <button
                onMouseEnter={(e) => moveNoButton(e.clientX, e.clientY)}
                onClick={(e) => moveNoButton(e.clientX, e.clientY)}
                onTouchStart={(e) => {
                  const t = e.touches[0];
                  moveNoButton(t.clientX, t.clientY);
                }}
                className="w-full sm:w-auto px-6 py-2 bg-red-500 text-white rounded-full whitespace-nowrap"
              >
                No 😜
              </button>
            )}
          </div>

          {moved && (
            <button
              ref={noRef}
              onMouseEnter={(e) => moveNoButton(e.clientX, e.clientY)}
              onTouchStart={(e) => {
                const t = e.touches[0];
                moveNoButton(t.clientX, t.clientY);
              }}
              style={{
                position: "fixed",
                top: noPosition.top,
                left: noPosition.left,
                zIndex: 100,
              }}
              className="px-6 py-2 bg-red-500 text-white rounded-full whitespace-nowrap"
            >
              No 😜
            </button>
          )}
        </div>
      ) : (
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-4">🎉 YES! 🎉</h1>

          <p className="mb-4 text-sm md:text-base text-gray-600">
            {`You just made me really happy 🥺💖  
Let’s make this something beautiful ❤️`}
          </p>

          <button
            onClick={share}
            className="px-4 py-2 bg-green-600 text-white rounded-full"
          >
            Share 💌
          </button>
        </div>
      )}
    </div>
  );
}
