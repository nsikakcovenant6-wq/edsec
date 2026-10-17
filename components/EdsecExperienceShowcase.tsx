"use client";
import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import {BookOpen,GraduationCap,Globe2,Laptop2,ShieldCheck,Sparkles,ArrowUpRight,School,CalendarDays} from "lucide-react";
const highlights=[
 {title:"Explore practical courses",detail:"Build career-ready digital skills",href:"/courses",icon:BookOpen},
 {title:"See real projects",detail:"Explore published student work",href:"/student-projects",icon:Laptop2},
 {title:"School digital platform",detail:"See how a connected school works",href:"/school-management-system/demo",icon:School},
 {title:"Verify a certificate",detail:"Check an issued EDSEC credential",href:"/verify",icon:ShieldCheck},
 {title:"Book a consultation",detail:"Discuss training or digital solutions",href:"/consultation",icon:CalendarDays},
 {title:"Partnerships",detail:"Explore collaboration opportunities",href:"/partnerships",icon:Globe2},
];
export default function EdsecExperienceShowcase(){
 const root=useRef<HTMLElement>(null);
 const [visible,setVisible]=useState(false);
 useEffect(()=>{const node=root.current;if(!node)return;const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setVisible(true);observer.disconnect()}},{threshold:.12});observer.observe(node);return()=>observer.disconnect()},[]);
 return <section ref={root} aria-labelledby="edsec-experience-title" className={`edsec-experience-section ${visible?"edsec-experience-visible":""}`}>
 <div className="edsec-experience-inner">
 <div className="edsec-experience-copy"><p className="edsec-experience-eyebrow"><Sparkles size={17}/> EXPLORE EDSEC DIGITAL</p>
 <h2 id="edsec-experience-title">Technology you can <em>experience.</em></h2>
 <p>Discover practical training, real projects, school technology and professional services—all connected in one place.</p>
 <div className="edsec-experience-actions"><Link href="/courses">Explore courses <ArrowUpRight size={18}/></Link><Link href="/consultation">Talk to EDSEC <ArrowUpRight size={18}/></Link></div></div>
 <div className="edsec-experience-orbit" aria-hidden="true"><div className="edsec-experience-halo"/><div className="edsec-experience-core"><Globe2 size={100} strokeWidth={1}/><strong>EDSEC</strong></div><span className="edsec-experience-satellite a"><Laptop2/></span><span className="edsec-experience-satellite b"><GraduationCap/></span><span className="edsec-experience-satellite c"><ShieldCheck/></span></div>
 <div className="edsec-experience-grid">{highlights.map(({title,detail,href,icon:Icon})=><Link key={href} href={href} className="edsec-experience-card"><Icon size={24}/><strong>{title}</strong><span>{detail}</span><ArrowUpRight className="edsec-experience-arrow" size={17}/></Link>)}</div>
 </div></section>;
}
