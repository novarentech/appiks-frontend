"use client";
import { useEffect, useState } from "react";
import SplashScreen from "./Splashscreen";

type Props = {
  children: React.ReactNode;
  imageSrc?: string;
  duration?: number;
  showOnce?: boolean;
};

export default function SplashWrapper({
  children,
  imageSrc = "/image/bgSplashScreen.webp",
  duration = 7000,
  showOnce = false,
}: Props) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    try {
      if (showOnce && sessionStorage.getItem("appiks_splash_seen") === "1") {
        setShowSplash(false);
      }
    } catch {
      // ignore storage errors
    }
  }, [showOnce]);

  return (
    <>
      {showSplash ? (
        <SplashScreen
          imageSrc={imageSrc}
          duration={duration}
          showOnce={showOnce}
          onFinish={() => setShowSplash(false)}
        />
      ) : (
        <>{children}</>
      )}
    </>
  );
}