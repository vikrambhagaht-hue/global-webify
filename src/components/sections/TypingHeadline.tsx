"use client";

import React, { useState, useEffect } from "react";

export const TypingHeadline = ({ phrases = [] }: { phrases?: string[] }) => {
  const defaultPhrases = [
    "वेबसाइट जो ब्रांड भी बनाए, बिज़नेस भी बढ़ाए।",
    "Websites that build brands, and grow businesses.",
  ];
  const activePhrases = phrases.length > 0 ? phrases : defaultPhrases;

  const [currentText, setCurrentText] = useState(activePhrases[0] || "");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [mounted, setMounted] = useState(false);
  const [isFirstPause, setIsFirstPause] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset animation if phrases change dynamically
  useEffect(() => {
    if (activePhrases.length > 0) {
      setCurrentText(activePhrases[0]);
      setIsDeleting(false);
      setLoopNum(0);
      setTypingSpeed(100);
    }
  }, [activePhrases.join('|')]);

  useEffect(() => {
    if (!mounted || activePhrases.length === 0) return;
    
    const i = loopNum % activePhrases.length;
    const fullText = activePhrases[i];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText === fullText) {
          setIsDeleting(true);
          setTypingSpeed(isFirstPause ? 5000 : 3000);
          setIsFirstPause(false);
        } else {
          setCurrentText(fullText.substring(0, currentText.length + 1));
          setTypingSpeed(60);
        }
      } else {
        if (currentText === "") {
          setIsDeleting(false);
          setLoopNum(prev => prev + 1);
          setTypingSpeed(500);
        } else {
          setCurrentText(fullText.substring(0, currentText.length - 1));
          setTypingSpeed(30);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, loopNum, mounted, typingSpeed, activePhrases]);

  // Find the longest phrase to reserve space and prevent layout shift for SEO
  const longestPhrase = activePhrases.reduce((a, b) => a.length > b.length ? a : b, "");

  return (
    <div className="relative flex items-start justify-start w-full transition-all duration-300">
      <h1 className="text-[32px] sm:text-4xl md:text-[44px] font-extrabold md:font-black text-[#171717] leading-[1.35] tracking-tight text-left font-lexend">
        {/* SEO: hidden static text — Google reads this full phrase always */}
        <span className="sr-only">{activePhrases[0]}</span>
        {/* Invisible longest text to reserve exact layout space & prevent CLS */}
        <span className="invisible select-none" aria-hidden="true">
          {longestPhrase}
        </span>
        {/* Visual typing animation — absolutely positioned over the invisible text */}
        <span className="absolute top-0 left-0 w-full h-full" aria-hidden="true">
          {currentText}
          {/* CSS cursor blink */}
          <span className="inline-block w-[3px] h-[1em] bg-[#1a8b4c] ml-1 align-baseline relative top-[0.1em] animate-blink" />
        </span>
      </h1>
    </div>
  );
};
