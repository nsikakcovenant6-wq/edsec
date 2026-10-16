"use client";

import Image from "next/image";
import {usePathname} from "next/navigation";
import {useEffect, useRef, useState} from "react";

export default function EdsecPageTransition() {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);
  const [active, setActive] = useState(false);
  const [sequence, setSequence] = useState(0);

  useEffect(() => {
    if (previousPath.current === null) {
      previousPath.current = pathname;
      return;
    }
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const show = window.setTimeout(() => {
      setSequence(n => n + 1);
      setActive(true);
    }, 0);
    const hide = window.setTimeout(() => setActive(false), 1050);
    return () => {window.clearTimeout(show);window.clearTimeout(hide);};
  }, [pathname]);

  if (!active) return null;
  return (
    <div key={sequence} className="edsec-route-overlay" role="status" aria-live="polite" aria-label="EDSEC page transition">
      <div className="edsec-route-aura" aria-hidden="true" />
      <div className="edsec-route-stars" aria-hidden="true" />
      <div className="edsec-route-stage">
        <div className="edsec-route-orbit edsec-route-orbit-one" aria-hidden="true" />
        <div className="edsec-route-orbit edsec-route-orbit-two" aria-hidden="true" />
        <div className="edsec-route-emblem">
          <Image src="/edsec-logo.png" width={108} height={108} alt="EDSEC ICT Institute logo" priority className="h-24 w-24 object-contain" />
        </div>
        <p className="edsec-route-title">EDSEC</p>
        <p className="edsec-route-subtitle">INNOVATE · EDUCATE · ELEVATE</p>
      </div>
    </div>
  );
}
