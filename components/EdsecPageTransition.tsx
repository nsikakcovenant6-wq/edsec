"use client";

import Image from "next/image";
import {usePathname} from "next/navigation";
import {useEffect, useRef, useState} from "react";

function sceneForPath(path: string) {
  if (path === "/") return "globe";
  if (path.startsWith("/about")) return "timeline";
  if (path.startsWith("/courses")) return "learning";
  if (path.startsWith("/services")) return "laptop";
  if (path.startsWith("/school-management-system") || path.startsWith("/school-portfolio")) return "school-devices";
  if (path.startsWith("/certification") || path.startsWith("/certificate")) return "certificates";
  if (path.startsWith("/gallery")) return "photo-wall";
  if (path.startsWith("/partnership") || path.startsWith("/partners") || path.startsWith("/corporate-training")) return "connections";
  if (path.startsWith("/contact")) return "location";
  if (path.startsWith("/student-projects")) return "portal";
  if (path.startsWith("/blog")) return "circuit";
  if (path.startsWith("/admin") || path.startsWith("/student")) return "circuit";
  return "globe";
}

export default function EdsecPageTransition() {
  const pathname = usePathname();
  const scene = sceneForPath(pathname);
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
    const hide = window.setTimeout(() => setActive(false), 4000);
    return () => {window.clearTimeout(show);window.clearTimeout(hide);};
  }, [pathname]);

  if (!active) return null;
  return (
    <div key={sequence} className={`edsec-route-overlay edsec-scene-${scene}`} role="status" aria-live="polite" aria-label="EDSEC page transition">
      <div className="edsec-transition-particles" aria-hidden="true" />
      {scene === "circuit" && <div className="edsec-circuit-board" aria-hidden="true"><span /><span /><span /><span /><span /><span /><b /></div>}
      <div className="edsec-route-aura" aria-hidden="true" />
      <div className="edsec-route-stars" aria-hidden="true" />
      <div className="edsec-route-stage">
        {scene === "globe" && <div className="edsec-technology-icons" aria-hidden="true"><span>⌘</span><span>◈</span><span>✦</span><span>⌬</span></div>}
        {scene === "timeline" && <div className="edsec-special-timeline" aria-hidden="true"><span>2020</span><span>INNOVATE</span><span>EDUCATE</span><span>ELEVATE</span></div>}
        {scene === "learning" && <div className="edsec-special-learning" aria-hidden="true"><span>▤</span><span>▣</span><span>⌘</span><span>✦</span></div>}
        {scene === "laptop" && <div className="edsec-special-laptop" aria-hidden="true"><div className="edsec-special-screen"><span>EDSEC DIGITAL</span><i/><i/><i/></div><div className="edsec-special-keyboard"/></div>}
        {scene === "school-devices" && <div className="edsec-special-devices" aria-hidden="true"><div className="edsec-special-monitor"><span>School Dashboard</span><i/><i/><i/></div><div className="edsec-special-mobile"><span>EDSEC</span><i/><i/></div></div>}
        {scene === "certificates" && <div className="edsec-special-certificates" aria-hidden="true"><span>★<small>CERTIFICATE</small></span><span>✧<small>EDSEC</small></span><span>★<small>ACHIEVEMENT</small></span></div>}
        {scene === "photo-wall" && <div className="edsec-special-photo-wall" aria-hidden="true"><span>▧</span><span>▧</span><span>▧</span><span>▧</span></div>}
        {scene === "connections" && <div className="edsec-special-connections" aria-hidden="true"><span/><span/><span/><span/></div>}
        {scene === "location" && <div className="edsec-special-location" aria-hidden="true"><div className="edsec-location-map"/><div className="edsec-location-pin">●</div></div>}
        {scene === "campus" && <div className="edsec-scene-campus" aria-hidden="true"><div className="edsec-campus-roof" /><div className="edsec-campus-sign">EDSEC</div><div className="edsec-campus-door" /><div className="edsec-campus-windows" /><div className="edsec-campus-people"><i /><i /><i /></div></div>}
        {scene === "robot" && <div className="edsec-scene-robot" aria-hidden="true"><div className="edsec-robot-head"><i /><i /></div><div className="edsec-robot-body">EDSEC</div><div className="edsec-robot-arms" /><div className="edsec-robot-legs" /></div>}
        {scene === "portal" && <div className="edsec-scene-portal" aria-hidden="true"><span /><span /><span /></div>}
        {scene === "books" && <div className="edsec-scene-books" aria-hidden="true"><span /><span /><span /></div>}
        {scene === "flying-robot" && <div className="edsec-flying-robot" aria-hidden="true"><div className="edsec-flying-head"><i /><i /></div><div className="edsec-flying-body" /><div className="edsec-flying-thruster" /><div className="edsec-flying-trail" /></div>}
        {scene === "rocket" && <div className="edsec-scene-rocket" aria-hidden="true">🚀</div>}
        <div className="edsec-route-globe" aria-hidden="true"><div className="edsec-route-globe-latitude" /><div className="edsec-route-globe-longitude" /><div className="edsec-route-globe-longitude edsec-route-globe-longitude-alt" /></div>
        <div className="edsec-route-satellite" aria-hidden="true"><span className="edsec-route-satellite-core" /><span className="edsec-route-satellite-wing" /></div>
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
