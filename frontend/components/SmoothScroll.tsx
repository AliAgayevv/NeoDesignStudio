"use client";
import { useEffect, ReactNode, useRef } from "react";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    // Create the Lenis instance
    const scroller = new Lenis();
    lenisRef.current = scroller;

    // Set up the animation frame
    const raf = (time: number) => {
      scroller.raf(time);
      requestRef.current = requestAnimationFrame(raf);
    };

    // Start the animation loop
    requestRef.current = requestAnimationFrame(raf);

    // Cleanup function
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }

      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  return <div>{children}</div>;
}
