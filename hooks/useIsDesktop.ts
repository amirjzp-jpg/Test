"use client";

import { useEffect, useState } from "react";

export function useIsDesktop(breakpoint = 768): boolean {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${breakpoint}px)`);
    setIsDesktop(query.matches);
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, [breakpoint]);

  return isDesktop;
}
