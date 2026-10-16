"use client";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect,useState} from "react";
const links=[["Home","/"],["Courses","/courses"],["Services","/services"],["About","/about"],["School Platform","/school-management-system"],["School Demo","/school-management-system/demo"],["Corporate Training","/corporate-training"],["Certification","/certification"],["Projects","/student-projects"],["Gallery","/gallery"],["Blog","/blog"],["Contact","/contact"],["Apply Now","/apply"]];
export default function EdsecImmersiveMenu(){
 const [open,setOpen]=useState(false);
 const [mode,setMode]=useState("globe");
 const pathname=usePathname();
 useEffect(()=>{setOpen(false)},[pathname]);
 useEffect(()=>{if(!open)return;const old=document.body.style.overflow;document.body.style.overflow="hidden";const key=(e:KeyboardEvent)=>{if(e.key==="Escape")setOpen(false)};window.addEventListener("keydown",key);return()=>{document.body.style.overflow=old;window.removeEventListener("keydown",key)}},[open]);
 return <>
 <button type="button" onClick={()=>setOpen(true)} className="edsec-menu-trigger" aria-haspopup="dialog" aria-expanded={open}>☷ <span>Explore 3D Menu</span></button>
 {open&&<div className={`edsec-immersive-menu edsec-menu-view-${mode}`} role="dialog" aria-modal="true" aria-label="EDSEC navigation">
 <div className="edsec-menu-glow" aria-hidden="true"/>
 <header className="edsec-menu-top"><div className="edsec-menu-brand"><Image src="/edsec-logo.png" width={48} height={48} alt="EDSEC logo"/><strong>EDSEC <small>INNOVATE · EDUCATE · ELEVATE</small></strong></div><button type="button" onClick={()=>setOpen(false)} className="edsec-menu-close" aria-label="Close menu">✕</button></header>
 <div className="edsec-menu-layouts">{[["globe","Holographic"],["sidebar","Glass sidebar"],["cards","Floating cards"],["phone","3D phone"]].map(([key,label])=><button key={key} type="button" aria-pressed={mode===key} className={mode===key?"selected":""} onClick={()=>setMode(key)}>{label}</button>)}</div>
 <div className="edsec-menu-content">
 <div className="edsec-menu-visual" aria-hidden="true">
 {mode==="globe"&&<div className="edsec-menu-planet"><span className="edsec-menu-planet-ring"/><Image src="/edsec-logo.png" width={86} height={86} alt=""/></div>}
 {mode==="sidebar"&&<div className="edsec-menu-glass-layers"><i/><i/><i/></div>}
 {mode==="cards"&&<div className="edsec-menu-floating-shapes"><i/><i/><i/></div>}
 {mode==="phone"&&<div className="edsec-menu-phone"><div className="edsec-menu-phone-camera"/><Image src="/edsec-logo.png" width={70} height={70} alt=""/><strong>EDSEC</strong><span>Explore the future</span><div className="edsec-menu-phone-bars"><i/><i/><i/></div></div>}
 </div>
 <nav className="edsec-menu-links" aria-label="Site pages">{links.map(([title,href],i)=><Link key={href} href={href} onClick={()=>setOpen(false)} className={`edsec-menu-link ${i>0&&i<4?"edsec-menu-feature":""}`} aria-current={pathname===href?"page":undefined}><span aria-hidden="true">✧</span><span>{title}</span><span aria-hidden="true">↗</span></Link>)}</nav>
 </div></div>}
 </>;
}
