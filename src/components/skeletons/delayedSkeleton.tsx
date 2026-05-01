"use client";

import { useEffect, useState } from "react";

// Only show its children after `delay` ms. Avoids the skeleton flash on fast
// navigations — if the page loads within the delay, nothing renders.
export function DelayedSkeleton({
  children,
  delay = 250,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!show) return null;
  return <>{children}</>;
}
