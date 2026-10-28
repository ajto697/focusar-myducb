"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { IntroOverlay } from "../components/IntroOverlay";
import { MainHero } from "../components/MainHero";
import { useOnboardingStore } from "../store/useOnboardingStore";

export default function Home() {
  const router = useRouter();
  const { isOnboarded } = useOnboardingStore();
  const [showIntro, setShowIntro] = useState<boolean | null>(null);

  useEffect(() => {
    // If already onboarded, go straight to dashboard
    if (isOnboarded) {
      router.replace("/dashboard");
      return;
    }
    const hasSeen = localStorage.getItem("focusar_has_seen_intro");
    if (!hasSeen) {
      setShowIntro(true);
    } else {
      // First time without onboarding -> redirect to onboarding
      router.replace("/onboarding");
    }
  }, [isOnboarded]);

  if (showIntro === null) {
    return <div className="min-h-screen bg-[#0B0F19]" />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <IntroOverlay
            key="intro"
            onComplete={() => {
              localStorage.setItem("focusar_has_seen_intro", "1");
              setShowIntro(false);
              router.push("/onboarding");
            }}
          />
        )}
      </AnimatePresence>

      {!showIntro && <MainHero onReplayIntro={() => setShowIntro(true)} />}
    </>
  );
}
