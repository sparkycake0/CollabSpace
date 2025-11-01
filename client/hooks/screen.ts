"use client";
import { useState, useEffect } from "react";

export function useIsMobile(breakpoint: number = 786) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
  }, [breakpoint]);
  return isMobile;
}
