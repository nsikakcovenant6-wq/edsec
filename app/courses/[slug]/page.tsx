import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Cloud,
  Code2,
  GraduationCap,
  Laptop,
  Lightbulb,
  MessageCircle,
  Palette,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wifi,
  Wrench,
  Zap,
} from "lucide-react";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

type CourseVisual = {
  category: string;
  level: string;
  accent: string;
  icon: typeof Code2;
  tagline: string;
  heroText: string;
  whoFor: string[];
  learn: string[];
  canDo: string[];
  opportunities: string[];
  projects: string[];
  experience: string[];
  advantages: string[];
  journey: {
    stage: string;
    title: string;
    description: string;
  }[];
  requirements: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
};

const COURSE_VISUALS: Record<string, CourseVisual> = {
  "full-stack-web-development": {
    category: "Development",
    level: "Beginner to Advanced",
    accent: "from-blue-600 to-cyan-500",
    icon: Code2,
    tagline: "Turn ideas into complete digital products.",
    heroText:
      "Learn how to design, build, connect, secure, and deploy modern web applications from the frontend to the backend.",
    whoFor: [
      "Beginners who want to enter software development",
      "Students building a serious technology career",
      "Designers who want to become capable developers",
      "Entrepreneurs who want to build their own web products",
      "Developers who want structured full-stack training",
    ],
    learn: [
      "HTML, CSS and modern JavaScript",
      "Responsive and accessible web interfaces",
      "React and component-based development",
      "Next.js and TypeScript",
      "Backend development and REST APIs",
      "Authentication and authorization",
      "SQL databases and data modelling",
      "Git, GitHub and collaborative workflows",
      "Application deployment and hosting",
      "Professional software development practices",
    ],
    canDo: [
      "Build responsive websites and web applications",
      "Create dashboards and authenticated platforms",
      "Connect frontend applications to backend APIs",
      "Design and work with relational databases",
      "Build user registration and login systems",
      "Deploy applications for real users",
    ],
    opportunities: [
      "Frontend Developer",
      "Backend Developer",
      "Full-Stack Developer",
      "Web Developer",
      "Junior Software Engineer",
      "Freelance Web Developer",
      "Startup/Product Builder",
    ],
    projects: [
      "Professional business website",
      "Student learning management system",
      "Authentication-enabled dashboard",
      "Online booking platform",
      "Mini e-commerce application",
      "API-powered business application",
    ],
    experience: [
      "Instructor-led technical sessions",
      "Hands-on coding exercises",
      "Debugging and problem-solving practice",
      "Git and GitHub workflow practice",
      "Real project development",
      "Code review and improvement",
    ],
    advantages: [
      "Learn by building instead of memorising syntax",
      "Work with technologies used in modern web development",
      "Develop a portfolio while learning",
      "Understand both frontend and backend concepts",
      "Build confidence solving real development problems",
      "Create projects that demonstrate practical ability",
    ],
    journey: [
      {
        stage: "01",
        title: "Foundation",
        description:
          "Understand the web, programming fundamentals, HTML, CSS and JavaScript.",
      },
      {
        stage: "02",
        title: "Frontend",
        description:
          "Build modern interfaces with React, responsive design and reusable components.",
      },
      {
        stage: "03",
        title: "Backend",
        description:
          "Create APIs, authentication systems, databases and application logic.",
      },
      {
        stage: "04",
        title: "Professional",
        description:
          "Connect everything, deploy applications and build portfolio-ready products.",
      },
    ],
    requirements: [
      "Basic computer literacy",
      "No previous professional programming experience required",
      "A willingness to practise outside class",
      "Consistent attendance and commitment",
      "A laptop is strongly recommended for extended practice",
    ],
    faqs: [
      {
        question: "Do I need to know programming before starting?",
        answer:
          "No. The program is structured to take beginners from the fundamentals toward practical full-stack development.",
      },
      {
        question: "Will I build real projects?",
        answer:
          "Yes. Practical projects are used throughout the learning journey so you can turn concepts into working applications.",
      },
      {
        question: "Can this prepare me for freelance work?",
        answer:
          "The course develops practical web development skills and portfolio projects that can support freelance and employment opportunities.",
      },
      {
        question: "Will I learn both frontend and backend?",
        answer:
          "Yes. The program covers the major parts of a modern full-stack workflow, from interface development to APIs and databases.",
      },
    ],
  },

  cybersecurity: {
    category: "Security",
    level: "Beginner to Intermediate",
    accent: "from-violet-600 to-blue-600",
    icon: ShieldCheck,
    tagline: "Learn to think like a defender.",
    heroText:
      "Develop practical cybersecurity knowledge for identifying threats, protecting systems, understanding vulnerabilities, and responding to security incidents.",
    whoFor: [
      "Students interested in cybersecurity",
      "IT professionals moving toward security",
      "Computer science and technology students",
      "People interested in security operations",
      "Beginners who want a structured security foundation",
    ],
    learn: [
      "Cybersecurity concepts and terminology",
      "Common threats and attack techniques",
      "Network security fundamentals",
      "Operating system security",
      "Identity and access management",
      "Authentication and authorization",
      "Security monitoring concepts",
      "Vulnerability awareness",
      "Incident response fundamentals",
      "Security best practices",
    ],
    canDo: [
      "Recognise common cybersecurity threats",
      "Analyse basic security risks",
      "Apply safer authentication practices",
      "Understand network security concepts",
      "Investigate basic security events",
      "Apply security controls to everyday systems",
    ],
    opportunities: [
      "Junior Cybersecurity Analyst",
      "Security Operations Intern",
      "IT Security Assistant",
      "SOC Trainee",
      "IT Support with Security Responsibilities",
      "Cybersecurity Freelancer",
      "Security Awareness Trainer",
    ],
    projects: [
      "Security awareness campaign",
      "Basic network security assessment",
      "Password security demonstration",
      "Incident response simulation",
      "Security monitoring exercise",
      "Vulnerability identification project",
    ],
    experience: [
      "Security-focused practical exercises",
      "Threat identification scenarios",
      "Network and system security activities",
      "Incident-response simulations",
      "Security awareness exercises",
      "Guided technical troubleshooting",
    ],
    advantages: [
      "Build security thinking rather than only tool familiarity",
      "Understand how attacks and defenses relate",
      "Practise analysing realistic security scenarios",
      "Develop a strong foundation for advanced certifications",
      "Connect cybersecurity with everyday IT operations",
      "Learn responsible and ethical security practices",
    ],
    journey: [
      {
        stage: "01",
        title: "Security Foundation",
        description:
          "Understand cybersecurity principles, threats, risks and the security mindset.",
      },
      {
        stage: "02",
        title: "Systems & Networks",
        description:
          "Explore operating systems, networking and the common weaknesses attackers target.",
      },
      {
        stage: "03",
        title: "Defense",
        description:
          "Study authentication, monitoring, access control and practical defensive techniques.",
      },
      {
        stage: "04",
        title: "Security Operations",
        description:
          "Apply your knowledge through scenarios, investigations and incident-response exercises.",
      },
    ],
    requirements: [
      "Basic computer knowledge",
      "Interest in technology and security",
      "Willingness to learn technical concepts",
      "Commitment to practical exercises",
      "No previous cybersecurity job experience required",
    ],
    faqs: [
      {
        question: "Is cybersecurity only for advanced programmers?",
        answer:
          "No. Cybersecurity includes networking, systems, identity, monitoring, risk and many other areas beyond programming.",
      },
      {
        question: "Will the training include practical exercises?",
        answer:
          "Yes. Practical scenarios and exercises are used to help students understand how security concepts work in real situations.",
      },
      {
        question: "Can I continue to professional certifications afterward?",
        answer:
          "Yes. A strong foundation can help you prepare for further cybersecurity learning and industry certifications.",
      },
      {
        question: "Is ethical behaviour part of the course?",
        answer:
          "Absolutely. Security knowledge must be applied responsibly, legally and ethically.",
      },
    ],
  },

  "graphic-design": {
    category: "Creative",
    level: "Beginner to Advanced",
    accent: "from-pink-600 to-orange-500",
    icon: Palette,
    tagline: "Turn ideas into visual experiences.",
    heroText:
      "Develop the creative and technical skills required to design professional graphics, brand materials, marketing visuals and digital content.",
    whoFor: [
      "Aspiring graphic designers",
      "Social media managers and content creators",
      "Entrepreneurs building their brands",
      "Students interested in creative technology",
      "Freelancers who want marketable design skills",
    ],
    learn: [
      "Design principles and visual hierarchy",
      "Typography and font pairing",
      "Colour theory and visual balance",
      "Composition and layout",
      "Logo and brand identity design",
      "Flyer and poster design",
      "Social media graphics",
      "Advertising creatives",
      "Presentation and portfolio design",
      "Professional design workflows",
    ],
    canDo: [
      "Create professional marketing graphics",
      "Develop visual identities for businesses",
      "Design social media content",
      "Produce flyers, posters and adverts",
      "Create presentation visuals",
      "Build a professional design portfolio",
    ],
    opportunities: [
      "Graphic Designer",
      "Brand Designer",
      "Social Media Designer",
      "Marketing Creative",
      "Freelance Designer",
      "Content Designer",
      "Creative Assistant",
    ],
    projects: [
      "Complete brand identity",
      "Business logo collection",
      "Social media campaign",
      "Event flyer series",
      "Product advertising campaign",
      "Professional design portfolio",
    ],
    experience: [
      "Creative design challenges",
      "Instructor demonstrations",
      "Design critiques and refinement",
      "Branding exercises",
      "Marketing design projects",
      "Portfolio development",
    ],
    advantages: [
      "Learn design with business use cases in mind",
      "Build a portfolio instead of only completing exercises",
      "Develop both creative and technical thinking",
      "Understand why professional designs work",
      "Practise turning client ideas into visual concepts",
      "Learn skills applicable to freelance work",
    ],
    journey: [
      {
        stage: "01",
        title: "Design Fundamentals",
        description:
          "Understand composition, typography, colour, spacing and visual hierarchy.",
      },
      {
        stage: "02",
        title: "Design Production",
        description:
          "Create practical flyers, posters, social media graphics and promotional materials.",
      },
      {
        stage: "03",
        title: "Branding",
        description:
          "Learn how logos, colours, typography and visual systems work together.",
      },
      {
        stage: "04",
        title: "Professional Portfolio",
        description:
          "Complete polished projects that demonstrate your creative ability to potential clients.",
      },
    ],
    requirements: [
      "Basic computer literacy",
      "Creativity and willingness to experiment",
      "No previous professional design experience required",
      "Commitment to practising design",
      "A laptop is recommended for personal practice",
    ],
    faqs: [
      {
        question: "Do I need to be naturally artistic?",
        answer:
          "You do not need to be an artist. Design can be learned through principles, practice, feedback and repetition.",
      },
      {
        question: "Will I have projects for my portfolio?",
        answer:
          "Yes. The learning approach focuses heavily on practical design projects that can be refined into portfolio pieces.",
      },
      {
        question: "Can graphic design become a freelance business?",
        answer:
          "Yes. Graphic design can support freelance services such as branding, advertising creatives, social media design and marketing materials.",
      },
    ],
  },

  "data-analysis": {
    category: "Data",
    level: "Beginner to Intermediate",
    accent: "from-emerald-600 to-cyan-500",
    icon: BarChart3,
    tagline: "Turn raw information into useful decisions.",
    heroText:
      "Learn how to clean, analyse, visualise and communicate data so organisations can make better decisions.",
    whoFor: [
      "Students interested in data careers",
      "Business owners who work with records and reports",
      "Administrative and finance professionals",
      "Analysts and aspiring business intelligence professionals",
      "Beginners who want practical data skills",
    ],
    learn: [
      "Data analysis fundamentals",
      "Microsoft Excel for analysis",
      "Data cleaning and preparation",
      "Formulas and functions",
      "Sorting and filtering",
      "Charts and data visualisation",
      "Pivot tables and summaries",
      "Dashboard concepts",
      "Business reporting",
      "Data interpretation",
    ],
    canDo: [
      "Clean messy business data",
      "Analyse sales and operational records",
      "Build useful charts and dashboards",
      "Identify trends and patterns",
      "Summarise large datasets",
      "Present findings clearly to decision-makers",
    ],
    opportunities: [
      "Junior Data Analyst",
      "Business Analyst Trainee",
      "Reporting Assistant",
      "Data Entry & Reporting Specialist",
      "Operations Analyst",
      "Freelance Data Assistant",
      "Business Intelligence Trainee",
    ],
    projects: [
      "Sales performance dashboard",
      "Student performance analysis",
      "Business expense report",
      "Customer analysis report",
      "Inventory analysis",
      "Monthly management dashboard",
    ],
    experience: [
      "Realistic datasets",
      "Step-by-step analysis exercises",
      "Dashboard-building practice",
      "Business reporting scenarios",
      "Data-cleaning challenges",
      "Presentation of findings",
    ],
    advantages: [
      "Learn how data supports business decisions",
      "Practise with realistic datasets",
      "Develop analytical thinking",
      "Create portfolio-ready dashboards",
      "Learn to communicate findings, not just calculate numbers",
      "Build a foundation for advanced analytics",
    ],
    journey: [
      {
        stage: "01",
        title: "Data Foundations",
        description:
          "Understand datasets, variables, data types, accuracy and the analytical process.",
      },
      {
        stage: "02",
        title: "Data Preparation",
        description:
          "Clean, organise and transform raw information into usable datasets.",
      },
      {
        stage: "03",
        title: "Analysis",
        description:
          "Use formulas, summaries and visualisation techniques to uncover useful insights.",
      },
      {
        stage: "04",
        title: "Business Intelligence",
        description:
          "Turn analysis into dashboards, reports and recommendations for decision-makers.",
      },
    ],
    requirements: [
      "Basic computer literacy",
      "Comfort using a keyboard and mouse",
      "Interest in numbers and problem solving",
      "No previous data-analysis experience required",
      "Willingness to practise with datasets",
    ],
    faqs: [
      {
        question: "Do I need to be very good at mathematics?",
        answer:
          "Advanced mathematics is not required for the foundation. The focus is on practical analysis, logic, organisation and interpretation.",
      },
      {
        question: "Will I learn Excel?",
        answer:
          "Yes. Excel is an important part of the practical data-analysis workflow covered in the program.",
      },
      {
        question: "Will I build dashboards?",
        answer:
          "Yes. Dashboard and visual-reporting exercises are included to help you communicate insights effectively.",
      },
    ],
  },

  "digital-marketing": {
    category: "Business",
    level: "Beginner",
    accent: "from-orange-500 to-pink-600",
    icon: BriefcaseBusiness,
    tagline: "Learn how businesses attract attention and customers online.",
    heroText:
      "Build practical digital marketing skills for creating campaigns, reaching audiences, growing brands and measuring results.",
    whoFor: [
      "Entrepreneurs and small-business owners",
      "Aspiring digital marketers",
      "Social media managers",
      "Content creators",
      "Students interested in online business",
    ],
    learn: [
      "Digital marketing fundamentals",
      "Audience and customer research",
      "Content strategy",
      "Social media marketing",
      "Search engine optimisation",
      "Digital advertising",
      "Campaign planning",
      "Email marketing fundamentals",
      "Marketing analytics",
      "Conversion-focused content",
    ],
    canDo: [
      "Create a basic digital marketing strategy",
      "Plan social media campaigns",
      "Research target audiences",
      "Create marketing content",
      "Understand digital advertising campaigns",
      "Measure and improve campaign performance",
    ],
    opportunities: [
      "Digital Marketing Assistant",
      "Social Media Manager",
      "Content Marketer",
      "Digital Marketing Freelancer",
      "Marketing Assistant",
      "Growth Marketing Trainee",
      "Small Business Marketing Consultant",
    ],
    projects: [
      "30-day social media campaign",
      "Complete digital marketing strategy",
      "Business content calendar",
      "Search optimisation exercise",
      "Advertising campaign plan",
      "Campaign performance report",
    ],
    experience: [
      "Campaign planning exercises",
      "Audience research",
      "Content creation activities",
      "Marketing strategy workshops",
      "Analytics interpretation",
      "Business case studies",
    ],
    advantages: [
      "Connect marketing theory with actual business goals",
      "Learn how to think about customers and audiences",
      "Build campaigns instead of only studying definitions",
      "Understand content, advertising and analytics together",
      "Develop skills useful for your own business",
      "Create practical marketing work for your portfolio",
    ],
    journey: [
      {
        stage: "01",
        title: "Marketing Foundation",
        description:
          "Understand audiences, positioning, customer journeys and digital channels.",
      },
      {
        stage: "02",
        title: "Content & Social",
        description:
          "Plan content and social media campaigns that communicate clear business messages.",
      },
      {
        stage: "03",
        title: "Growth",
        description:
          "Explore SEO, advertising, conversion and methods for reaching potential customers.",
      },
      {
        stage: "04",
        title: "Analytics",
        description:
          "Measure results and use campaign data to improve future marketing decisions.",
      },
    ],
    requirements: [
      "Basic computer literacy",
      "Interest in business or communication",
      "Access to a smartphone or computer for practice",
      "Creativity and willingness to experiment",
      "No previous marketing experience required",
    ],
    faqs: [
      {
        question: "Is this course useful for my own business?",
        answer:
          "Yes. The course is designed around practical marketing activities that can be adapted to real businesses and brands.",
      },
      {
        question: "Will social media marketing be covered?",
        answer:
          "Yes. Social media strategy, content planning, audience understanding and campaign concepts are core parts of the program.",
      },
      {
        question: "Can I freelance after learning digital marketing?",
        answer:
          "The skills can support freelance services such as social media management, content strategy and marketing support.",
      },
    ],
  },

  "it-support-networking": {
    category: "IT & Networking",
    level: "Beginner to Intermediate",
    accent: "from-cyan-600 to-blue-600",
    icon: Wifi,
    tagline: "Become the person people call when technology stops working.",
    heroText:
      "Build practical IT support and networking skills for installing, configuring, troubleshooting and maintaining everyday computer systems.",
    whoFor: [
      "Beginners entering IT support",
      "Students studying computer science",
      "Aspiring help desk technicians",
      "Small-business technology assistants",
      "Anyone interested in computer hardware and networking",
    ],
    learn: [
      "Computer hardware components",
      "Windows operating systems",
      "Software installation and configuration",
      "Hardware troubleshooting",
      "Printers and peripherals",
      "Networking fundamentals",
      "IP addressing",
      "Routers and switches",
      "Wi-Fi configuration",
      "LAN troubleshooting",
    ],
    canDo: [
      "Diagnose common computer problems",
      "Install and configure software",
      "Set up computers for users",
      "Configure basic networks",
      "Troubleshoot Wi-Fi and connectivity issues",
      "Support printers and peripherals",
      "Provide structured technical support",
    ],
    opportunities: [
      "IT Support Specialist",
      "Help Desk Technician",
      "Service Desk Analyst",
      "Desktop Support Technician",
      "IT Assistant",
      "Network Support Trainee",
      "Technical Support Freelancer",
    ],
    projects: [
      "Computer workstation setup",
      "Small-office LAN design",
      "Wi-Fi configuration exercise",
      "Troubleshooting case studies",
      "Printer and peripheral support exercise",
      "Basic network documentation",
    ],
    experience: [
      "Hardware identification exercises",
      "Hands-on troubleshooting",
      "Network configuration activities",
      "Operating-system setup",
      "Technical support scenarios",
      "Structured diagnostic practice",
    ],
    advantages: [
      "Learn technology from the hardware upward",
      "Develop real troubleshooting habits",
      "Practise solving common workplace IT problems",
      "Understand how devices communicate across networks",
      "Build a foundation for networking and cybersecurity",
      "Prepare for entry-level IT support roles",
    ],
    journey: [
      {
        stage: "01",
        title: "Computer Foundations",
        description:
          "Understand hardware, operating systems, software and the role of IT support.",
      },
      {
        stage: "02",
        title: "Troubleshooting",
        description:
          "Learn systematic methods for diagnosing and resolving computer problems.",
      },
      {
        stage: "03",
        title: "Networking",
        description:
          "Understand IP addresses, LANs, Wi-Fi, routers and basic network troubleshooting.",
      },
      {
        stage: "04",
        title: "Professional Support",
        description:
          "Practise handling realistic support requests and documenting technical solutions.",
      },
    ],
    requirements: [
      "Basic computer literacy",
      "Interest in hardware and technology",
      "No previous IT support job required",
      "Willingness to perform practical exercises",
      "A laptop is helpful for continued practice",
    ],
    faqs: [
      {
        question: "Is this suitable for someone completely new to IT?",
        answer:
          "Yes. The program begins with computer and operating-system fundamentals before moving into troubleshooting and networking.",
      },
      {
        question: "Will I work with networking?",
        answer:
          "Yes. Networking fundamentals, IP addressing, Wi-Fi, LAN concepts and troubleshooting are included.",
      },
      {
        question: "Can this lead to cybersecurity?",
        answer:
          "Yes. Strong IT and networking fundamentals provide an excellent foundation for progressing into cybersecurity.",
      },
    ],
  },

  "ui-ux-design": {
    category: "Design",
    level: "Beginner to Advanced",
    accent: "from-fuchsia-600 to-violet-600",
    icon: Palette,
    tagline: "Design products people understand, enjoy and remember.",
    heroText:
      "Learn how to research users, structure information, design interfaces, prototype experiences and improve digital products.",
    whoFor: [
      "Aspiring UI/UX designers",
      "Graphic designers moving into digital products",
      "Developers who want stronger design skills",
      "Entrepreneurs building apps or websites",
      "Creative students interested in product design",
    ],
    learn: [
      "UI and UX principles",
      "User research",
      "User personas",
      "Customer journeys",
      "Information architecture",
      "Wireframing",
      "High-fidelity interface design",
      "Prototyping",
      "Design systems",
      "Usability testing",
    ],
    canDo: [
      "Research and understand target users",
      "Create user flows and wireframes",
      "Design modern interfaces",
      "Build clickable prototypes",
      "Create reusable design systems",
      "Identify usability problems",
    ],
    opportunities: [
      "UI Designer",
      "UX Designer",
      "Product Designer",
      "UX Research Assistant",
      "Design Intern",
      "Freelance UI/UX Designer",
      "Product Design Assistant",
    ],
    projects: [
      "Mobile banking interface",
      "Student portal redesign",
      "E-commerce user experience",
      "Mobile app prototype",
      "SaaS dashboard design",
      "Complete UX case study",
    ],
    experience: [
      "User research exercises",
      "Wireframing workshops",
      "Interface design challenges",
      "Prototype testing",
      "Design critiques",
      "Portfolio case-study development",
    ],
    advantages: [
      "Learn to solve user problems, not simply decorate screens",
      "Understand the thinking behind good interfaces",
      "Develop portfolio-ready case studies",
      "Practise research, design and testing as one workflow",
      "Build skills useful when working with developers",
      "Develop a professional product-design mindset",
    ],
    journey: [
      {
        stage: "01",
        title: "Understand Users",
        description:
          "Learn research, personas, user journeys and the problems digital products need to solve.",
      },
      {
        stage: "02",
        title: "Structure",
        description:
          "Turn research into information architecture, user flows and wireframes.",
      },
      {
        stage: "03",
        title: "Design",
        description:
          "Create polished interfaces, components, layouts and interactive prototypes.",
      },
      {
        stage: "04",
        title: "Validate",
        description:
          "Test designs, identify usability issues and present a complete design case study.",
      },
    ],
    requirements: [
      "Basic computer literacy",
      "Interest in design and problem solving",
      "No previous UI/UX experience required",
      "Willingness to receive and apply design feedback",
      "A laptop is recommended",
    ],
    faqs: [
      {
        question: "Is UI/UX the same as graphic design?",
        answer:
          "No. Graphic design focuses heavily on visual communication, while UI/UX also considers users, workflows, usability and product interaction.",
      },
      {
        question: "Will I create portfolio projects?",
        answer:
          "Yes. Practical product-design projects and case studies are central to the learning experience.",
      },
      {
        question: "Can developers benefit from UI/UX training?",
        answer:
          "Definitely. Understanding users, layouts and interaction patterns can make developers much stronger product builders.",
      },
    ],
  },

  "microsoft-office-professional": {
    category: "Productivity",
    level: "Beginner to Advanced",
    accent: "from-blue-600 to-indigo-600",
    icon: Laptop,
    tagline: "Master the tools used every day in modern offices.",
    heroText:
      "Build professional Microsoft Office skills for documents, spreadsheets, presentations, reporting and everyday workplace productivity.",
    whoFor: [
      "Students preparing for employment",
      "Office workers improving productivity",
      "Job seekers building digital skills",
      "Business owners and administrators",
      "Beginners who want professional computer skills",
    ],
    learn: [
      "Microsoft Word",
      "Microsoft Excel",
      "Microsoft PowerPoint",
      "Professional document formatting",
      "Excel formulas and functions",
      "Tables and spreadsheets",
      "Charts and reports",
      "Professional presentations",
      "Business document workflows",
      "Digital workplace productivity",
    ],
    canDo: [
      "Create professional business documents",
      "Build useful spreadsheets",
      "Analyse basic business information in Excel",
      "Create professional presentations",
      "Format reports and proposals",
      "Work more efficiently with office software",
    ],
    opportunities: [
      "Administrative Assistant",
      "Office Assistant",
      "Data Entry Specialist",
      "Executive Assistant",
      "Customer Service Assistant",
      "Records Officer",
      "Business Support Assistant",
    ],
    projects: [
      "Professional business report",
      "Employee attendance spreadsheet",
      "Sales tracking workbook",
      "Business presentation",
      "Invoice and expense tracker",
      "Office productivity project",
    ],
    experience: [
      "Instructor demonstrations",
      "Guided computer exercises",
      "Document creation tasks",
      "Excel practice datasets",
      "Presentation-building exercises",
      "Workplace simulation activities",
    ],
    advantages: [
      "Build skills directly applicable to office work",
      "Practise common workplace tasks",
      "Improve speed and confidence with computers",
      "Develop professional document habits",
      "Create useful spreadsheet and presentation projects",
      "Build a foundation for further digital training",
    ],
    journey: [
      {
        stage: "01",
        title: "Computer Productivity",
        description:
          "Understand workplace computer workflows and professional file management.",
      },
      {
        stage: "02",
        title: "Documents",
        description:
          "Create polished reports, letters, tables and professional business documents.",
      },
      {
        stage: "03",
        title: "Spreadsheets",
        description:
          "Use Excel formulas, functions, tables, charts and practical business data.",
      },
      {
        stage: "04",
        title: "Presentations",
        description:
          "Design clear, professional PowerPoint presentations and communicate information effectively.",
      },
    ],
    requirements: [
      "No previous Microsoft Office experience required",
      "Basic ability to use a computer",
      "Willingness to practise",
      "Commitment to regular attendance",
      "A laptop is useful for continued practice",
    ],
    faqs: [
      {
        question: "Is this course suitable for beginners?",
        answer:
          "Yes. The program can take students from basic office software use toward more advanced professional tasks.",
      },
      {
        question: "Will Excel be taught practically?",
        answer:
          "Yes. Students practise formulas, tables, charts and business-oriented spreadsheet tasks.",
      },
      {
        question: "Can this improve my employability?",
        answer:
          "Strong office-computing skills are useful across administrative, customer service, records, business support and many other roles.",
      },
    ],
  },

  "cloud-computing": {
    category: "Cloud Technology",
    level: "Beginner to Intermediate",
    accent: "from-sky-500 to-blue-700",
    icon: Cloud,
    tagline: "Understand the infrastructure powering modern digital services.",
    heroText:
      "Learn how cloud platforms deliver computing, storage, networking, databases and applications at modern scale.",
    whoFor: [
      "Computer science students",
      "Aspiring cloud engineers",
      "Developers moving toward cloud deployment",
      "IT professionals expanding their infrastructure skills",
      "Technology enthusiasts",
    ],
    learn: [
      "Cloud computing fundamentals",
      "Infrastructure concepts",
      "Cloud service models",
      "Cloud deployment models",
      "Virtual machines",
      "Cloud storage",
      "Cloud databases",
      "Cloud networking",
      "Identity and access management",
      "Cloud security fundamentals",
    ],
    canDo: [
      "Explain major cloud concepts",
      "Understand cloud architecture",
      "Work with virtualised infrastructure concepts",
      "Configure basic cloud resources",
      "Understand cloud networking",
      "Deploy simple applications to cloud environments",
    ],
    opportunities: [
      "Cloud Support Associate",
      "Cloud Operations Trainee",
      "Junior Cloud Engineer",
      "Cloud Administrator Trainee",
      "DevOps Trainee",
      "IT Infrastructure Assistant",
      "Cloud Support Freelancer",
    ],
    projects: [
      "Cloud-hosted website",
      "Virtual server deployment",
      "Cloud storage architecture",
      "Basic cloud network design",
      "Application deployment exercise",
      "Cloud security configuration exercise",
    ],
    experience: [
      "Infrastructure demonstrations",
      "Cloud architecture exercises",
      "Deployment practice",
      "Networking scenarios",
      "Identity and access exercises",
      "Cloud troubleshooting activities",
    ],
    advantages: [
      "Understand the technology behind modern applications",
      "Connect development with infrastructure",
      "Learn scalable computing concepts",
      "Practise deployment rather than only theory",
      "Build a foundation for cloud certifications",
      "Understand security and identity in cloud environments",
    ],
    journey: [
      {
        stage: "01",
        title: "Cloud Foundations",
        description:
          "Understand why organisations use cloud computing and how cloud services are structured.",
      },
      {
        stage: "02",
        title: "Infrastructure",
        description:
          "Explore compute, storage, databases, virtual machines and cloud networking.",
      },
      {
        stage: "03",
        title: "Security",
        description:
          "Learn identity, access control and important cloud-security principles.",
      },
      {
        stage: "04",
        title: "Deployment",
        description:
          "Apply your knowledge by deploying and managing practical cloud resources.",
      },
    ],
    requirements: [
      "Basic computer literacy",
      "Basic networking knowledge is helpful but not mandatory",
      "Interest in technology infrastructure",
      "Willingness to practise technical concepts",
      "A laptop is recommended",
    ],
    faqs: [
      {
        question: "Do I need to be a programmer?",
        answer:
          "No. Cloud computing includes infrastructure, networking, storage, identity and operations in addition to application development.",
      },
      {
        question: "Will deployment be covered?",
        answer:
          "Yes. The course introduces practical deployment concepts and exercises so students understand how applications run in cloud environments.",
      },
      {
        question: "Is cloud computing useful for developers?",
        answer:
          "Yes. Understanding deployment, infrastructure and cloud services can make developers much more effective at delivering complete applications.",
      },
    ],
  },

  "virtual-assistant": {
    category: "Professional Skills",
    level: "Beginner to Intermediate",
    accent: "from-amber-500 to-orange-600",
    icon: Users,
    tagline: "Build the skills to support businesses from anywhere.",
    heroText:
      "Learn the digital, organisational and communication skills needed to provide reliable virtual assistance to businesses and professionals.",
    whoFor: [
      "Beginners seeking remote-work skills",
      "Administrative professionals",
      "Students seeking flexible digital work",
      "Entrepreneurs who want remote support skills",
      "People interested in freelance services",
    ],
    learn: [
      "Virtual assistance fundamentals",
      "Professional communication",
      "Email management",
      "Calendar and appointment management",
      "Online research",
      "Microsoft Office",
      "Google Workspace",
      "Task and project management",
      "Customer support",
      "Remote-work professionalism",
    ],
    canDo: [
      "Manage professional email workflows",
      "Organise calendars and appointments",
      "Conduct structured online research",
      "Prepare documents and spreadsheets",
      "Track tasks and deadlines",
      "Support clients professionally online",
    ],
    opportunities: [
      "Virtual Assistant",
      "Administrative Assistant",
      "Executive Virtual Assistant",
      "Customer Support Assistant",
      "Remote Operations Assistant",
      "Research Assistant",
      "Freelance Virtual Assistant",
    ],
    projects: [
      "Executive calendar simulation",
      "Professional inbox management exercise",
      "Client research report",
      "Remote task-management board",
      "Business document package",
      "Virtual assistant service portfolio",
    ],
    experience: [
      "Remote-work simulations",
      "Professional email exercises",
      "Scheduling scenarios",
      "Research assignments",
      "Task-management practice",
      "Client communication exercises",
    ],
    advantages: [
      "Learn skills directly connected to remote work",
      "Practise professional communication",
      "Develop strong organisation habits",
      "Learn multiple productivity tools together",
      "Build confidence supporting real business workflows",
      "Create service examples for freelance opportunities",
    ],
    journey: [
      {
        stage: "01",
        title: "Professional Foundation",
        description:
          "Build communication, organisation and digital workplace habits.",
      },
      {
        stage: "02",
        title: "Productivity Tools",
        description:
          "Learn the tools used for documents, spreadsheets, email, calendars and collaboration.",
      },
      {
        stage: "03",
        title: "Client Support",
        description:
          "Practise research, customer communication, scheduling and task management.",
      },
      {
        stage: "04",
        title: "Remote Professional",
        description:
          "Simulate real client workflows and build examples of services you can offer.",
      },
    ],
    requirements: [
      "Basic computer literacy",
      "Good willingness to communicate professionally",
      "Basic internet skills",
      "Reliable commitment to learning",
      "A laptop or computer is recommended",
    ],
    faqs: [
      {
        question: "Can beginners become virtual assistants?",
        answer:
          "Yes. The course focuses on the practical tools, communication and organisation skills beginners need to start building professional capability.",
      },
      {
        question: "Will remote-work tools be taught?",
        answer:
          "Yes. Productivity, communication, document and task-management workflows form an important part of the program.",
      },
      {
        question: "Can I freelance with these skills?",
        answer:
          "Yes. Virtual assistance can be offered as a freelance service to entrepreneurs, professionals and businesses.",
      },
    ],
  },
};

const FALLBACK_VISUAL: CourseVisual = {
  category: "Technology",
  level: "Beginner to Advanced",
  accent: "from-cyan-600 to-blue-700",
  icon: GraduationCap,
  tagline: "Build practical skills for the digital world.",
  heroText:
    "Develop practical technology skills through structured lessons, guided practice and real-world projects.",
  whoFor: [
    "Students",
    "Beginners entering technology",
    "Professionals improving digital skills",
    "Entrepreneurs",
  ],
  learn: [
    "Core concepts",
    "Professional tools",
    "Practical workflows",
    "Problem solving",
    "Real-world applications",
    "Professional development",
  ],
  canDo: [
    "Apply the skills learned",
    "Complete practical tasks",
    "Solve common problems",
    "Build useful projects",
  ],
  opportunities: [
    "Entry-level technology roles",
    "Freelance opportunities",
    "Business applications",
    "Further professional training",
  ],
  projects: [
    "Practical portfolio project",
    "Business-focused project",
    "Real-world simulation",
  ],
  experience: [
    "Instructor-led learning",
    "Hands-on practice",
    "Project work",
    "Guided feedback",
  ],
  advantages: [
    "Practical learning",
    "Project-based training",
    "Professional guidance",
    "Structured progression",
  ],
  journey: [
    {
      stage: "01",
      title: "Foundation",
      description: "Understand the essential concepts.",
    },
    {
      stage: "02",
      title: "Practice",
      description: "Apply knowledge through guided exercises.",
    },
    {
      stage: "03",
      title: "Projects",
      description: "Build practical work.",
    },
    {
      stage: "04",
      title: "Professional",
      description: "Develop confidence for real-world application.",
    },
  ],
  requirements: [
    "Basic computer literacy",
    "Willingness to learn",
    "Commitment to practical training",
  ],
  faqs: [
    {
      question: "Is the course beginner friendly?",
      answer:
        "Yes. The learning path is structured to build understanding progressively.",
    },
    {
      question: "Is the training practical?",
      answer:
        "Yes. EDSEC focuses on practical learning, exercises and projects.",
    },
  ],
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1800&q=90";

const EDSEC_LOGO = "/edsec-logo.png";

const CERTIFICATE_FOCUS: Record<string, string> = {
  "full-stack-web-development":
    "demonstrating practical web development and application-building skills",
  cybersecurity:
    "demonstrating foundational cybersecurity awareness, defensive thinking and practical security skills",
  "graphic-design":
    "demonstrating practical visual communication, branding and graphic design skills",
  "data-analysis":
    "demonstrating practical data preparation, analysis, visualisation and reporting skills",
  "digital-marketing":
    "demonstrating practical digital marketing, campaign planning and audience-growth skills",
  "it-support-networking":
    "demonstrating practical computer support, troubleshooting and networking skills",
  "ui-ux-design":
    "demonstrating practical user research, interface design, prototyping and UX skills",
  "microsoft-office-professional":
    "demonstrating professional digital productivity and Microsoft Office skills",
  "cloud-computing":
    "demonstrating foundational cloud infrastructure, deployment and cloud technology skills",
  "virtual-assistant":
    "demonstrating professional virtual assistance, organisation and remote-work skills",
};

function isExternalImage(url: string) {
  return /^https?:\/\//i.test(url);
}

export async function generateStaticParams() {
  const courses = await prisma.course.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      slug: true,
    },
  });

  return courses.map((course) => ({
    slug: course.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: {
      slug,
    },
    select: {
      title: true,
      shortDescription: true,
      description: true,
      imageUrl: true,
      status: true,
    },
  });

  if (!course || course.status !== "ACTIVE") {
    return {
      title: "Course | EDSEC Computer Training",
    };
  }

  const description =
    course.description ||
    course.shortDescription ||
    `Learn ${course.title} at EDSEC Computer Training.`;

  return {
    title: `${course.title} | EDSEC Computer Training`,
    description,
    openGraph: {
      title: `${course.title} | EDSEC Computer Training`,
      description,
      images: course.imageUrl ? [course.imageUrl] : undefined,
    },
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: {
      slug,
    },
    include: {
      modules: {
        where: {
          isPublished: true,
        },
        orderBy: {
          displayOrder: "asc",
        },
        include: {
          lessons: {
            where: {
              isPublished: true,
            },
            orderBy: {
              displayOrder: "asc",
            },
            select: {
              id: true,
              title: true,
              duration: true,
              displayOrder: true,
            },
          },
        },
      },
    },
  });

  if (!course || course.status !== "ACTIVE") {
    notFound();
  }

  const visual = COURSE_VISUALS[course.slug] ?? FALLBACK_VISUAL;
  const CourseIcon = visual.icon;
  const image = course.imageUrl || FALLBACK_IMAGE;

  const totalLessons = course.modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  );

  const totalMinutes = course.modules.reduce(
    (total, module) =>
      total +
      module.lessons.reduce(
        (lessonTotal, lesson) => lessonTotal + (lesson.duration ?? 0),
        0,
      ),
    0,
  );

  const requirements = course.requirements
    ? course.requirements
        .split(/\r?\n|•/)
        .map((item) => item.trim())
        .filter(Boolean)
    : visual.requirements;

  const relatedCourses = await prisma.course.findMany({
    where: {
      status: "ACTIVE",
      slug: {
        not: course.slug,
      },
    },
    orderBy: [
      {
        featured: "desc",
      },
      {
        displayOrder: "asc",
      },
      {
        title: "asc",
      },
    ],
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      imageUrl: true,
      duration: true,
    },
  });

  const displayDuration = course.duration || "Flexible";
  const displayFormat = course.learningFormat || "Practical Training";

  const certificateFocus =
    CERTIFICATE_FOCUS[course.slug] ||
    "demonstrating practical knowledge and skills developed through EDSEC training";

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-950">
      <style>{`
        @keyframes edsecCertificateFloat {
          0%,
          100% {
            transform: translateY(0px) rotate(-1deg);
          }
          50% {
            transform: translateY(-12px) rotate(1deg);
          }
        }

        @keyframes edsecCertificateGlow {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(0.96);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.04);
          }
        }

        @keyframes edsecCertificateShine {
          0% {
            transform: translateX(-130%) rotate(18deg);
          }
          55%,
          100% {
            transform: translateX(160%) rotate(18deg);
          }
        }

        @keyframes edsecCertificateBadge {
          0%,
          100% {
            transform: scale(1) rotate(-4deg);
          }
          50% {
            transform: scale(1.08) rotate(4deg);
          }
        }

        .edsec-certificate-float {
          animation: edsecCertificateFloat 6s ease-in-out infinite;
        }

        .edsec-certificate-glow {
          animation: edsecCertificateGlow 5s ease-in-out infinite;
        }

        .edsec-certificate-badge {
          animation: edsecCertificateBadge 4s ease-in-out infinite;
        }

        .edsec-certificate-shine {
          animation: edsecCertificateShine 6s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .edsec-certificate-float,
          .edsec-certificate-glow,
          .edsec-certificate-badge,
          .edsec-certificate-shine {
            animation: none;
          }
        }
      `}</style>

      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            unoptimized={isExternalImage(image)}
            className="object-cover opacity-30"
          />

          <div className="absolute inset-0 bg-slate-950/80" />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/90 to-blue-950/50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(14,165,233,0.28),transparent_34%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-8 lg:px-8">
          <Link
            href="/courses"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-md transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to all courses
          </Link>
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-8 lg:grid-cols-[1fr_.82fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300 backdrop-blur-md">
              <Sparkles size={15} />
              EDSEC ICT INSTITUTE
            </div>

            <div className="mt-7 flex items-center gap-4">
              <div
                className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-linear-to-br ${visual.accent} shadow-2xl`}
              >
                <CourseIcon size={30} strokeWidth={1.7} />
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
                  {visual.category}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {visual.level} • Project-Based Learning
                </p>
              </div>
            </div>

            <h1 className="mt-7 max-w-4xl text-4xl font-black tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              {course.title}
            </h1>

            <p className="mt-5 max-w-3xl text-xl font-bold leading-8 text-white sm:text-2xl">
              {visual.tagline}
            </p>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              {visual.heroText}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <CourseBadge>{displayDuration}</CourseBadge>
              <CourseBadge>{visual.level}</CourseBadge>
              <CourseBadge cyan>{displayFormat}</CourseBadge>

              {totalLessons > 0 && (
                <CourseBadge>
                  {totalLessons} {totalLessons === 1 ? "lesson" : "lessons"}
                </CourseBadge>
              )}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/apply?course=${encodeURIComponent(course.slug)}`}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-bold text-slate-950 shadow-xl shadow-cyan-950/30 transition duration-300 hover:-translate-y-1 hover:bg-cyan-400"
              >
                Apply Now
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>

              <Link
                href="#course-details"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                Explore the course
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-cyan-400" />
                Practical training
              </span>

              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-cyan-400" />
                Real-world projects
              </span>

              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-cyan-400" />
                Career-focused
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-[3rem] bg-cyan-500/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-sm">
              <div className="relative aspect-4/3 overflow-hidden rounded-3xl">
                <Image
                  src={image}
                  alt={course.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  unoptimized={isExternalImage(image)}
                  className="object-cover transition duration-700 hover:scale-105"
                />

                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 right-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs font-bold text-cyan-300 backdrop-blur-md">
                    <Zap size={13} />
                    LEARN BY DOING
                  </div>

                  <p className="mt-3 text-2xl font-black text-white sm:text-3xl">
                    Learn. Build. Become.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 px-5">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/70 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<GraduationCap size={21} />}
            label="Program level"
            value={visual.level}
          />
          <StatCard
            icon={<Rocket size={21} />}
            label="Learning style"
            value="Project-Based"
          />
          <StatCard
            icon={<Target size={21} />}
            label="Duration"
            value={displayDuration}
          />
          <StatCard
            icon={<Laptop size={21} />}
            label="Training format"
            value={displayFormat}
          />
        </div>
      </section>

      <section
        id="course-details"
        className="scroll-mt-8 px-5 py-20 sm:py-24 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_360px]">
          <div>
            <SectionIntro
              eyebrow="Why this course?"
              title={visual.tagline}
              text={
                course.description ||
                course.shortDescription ||
                visual.heroText
              }
            />

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <InfoCard
                icon={<Users size={22} />}
                title="Who this is for"
                items={visual.whoFor}
              />

              <InfoCard
                icon={<Award size={22} />}
                title="What you will be able to do"
                items={visual.canDo}
              />
            </div>

            <section className="mt-16">
              <SectionHeading
                eyebrow="Learning outcomes"
                title="What you will learn"
                text="The skills are organised around practical abilities you can apply beyond the classroom."
              />

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {visual.learn.map((item) => (
                  <CheckItem key={item} text={item} />
                ))}
              </div>
            </section>

            <section className="mt-16 overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white sm:p-10">
              <div className="max-w-3xl">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-400">
                  Your transformation
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                  From learning concepts to doing the work.
                </h2>

                <p className="mt-4 leading-7 text-slate-400">
                  EDSEC is designed to help you move beyond knowing what
                  something is. You practise how to use it, how to solve
                  problems with it, and how to explain what you have built.
                </p>
              </div>

              <div className="mt-9 grid gap-4 sm:grid-cols-2">
                {visual.advantages.map((advantage, index) => (
                  <div
                    key={advantage}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400/10 text-sm font-black text-cyan-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <p className="mt-4 text-sm font-semibold leading-6 text-slate-200">
                      {advantage}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-16">
              <SectionHeading
                eyebrow="Career & business"
                title="Where these skills can take you"
                text="Your course is designed to give you practical skills that can support employment, freelancing, business and further learning."
              />

              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {visual.opportunities.map((opportunity) => (
                  <div
                    key={opportunity}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-50 text-cyan-600 transition group-hover:bg-cyan-500 group-hover:text-white">
                      <BriefcaseBusiness size={19} />
                    </div>

                    <p className="mt-4 text-sm font-black text-slate-900">
                      {opportunity}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-16">
              <SectionHeading
                eyebrow="Portfolio"
                title="Real projects you can build"
                text="Projects give you something concrete to practise, improve and eventually demonstrate."
              />

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {visual.projects.map((project, index) => (
                  <ProjectCard
                    key={project}
                    number={String(index + 1).padStart(2, "0")}
                    title={project}
                  />
                ))}
              </div>
            </section>

            <section className="mt-16">
              <SectionHeading
                eyebrow="Learning experience"
                title="How learning happens at EDSEC"
                text="A practical learning environment designed around understanding, practice, feedback and application."
              />

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {visual.experience.map((item, index) => (
                  <ExperienceCard
                    key={item}
                    number={index + 1}
                    title={item}
                  />
                ))}
              </div>
            </section>

            <section className="mt-16">
              <SectionHeading
                eyebrow="Skills you gain"
                title="Build a complete skill set"
                text="The goal is not one isolated skill. It is a combination of knowledge, practical ability and professional confidence."
              />

              <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50">
                <div className="grid gap-px bg-slate-200 sm:grid-cols-2">
                  {visual.learn.map((skill, index) => (
                    <div
                      key={skill}
                      className="flex items-center gap-4 bg-white p-5"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-950 text-xs font-black text-white">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="text-sm font-bold text-slate-700">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-16">
              <SectionHeading
                eyebrow="Beginner → advanced"
                title="Your learning journey"
                text="Progress through the course in stages so each new skill builds on what came before."
              />

              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {visual.journey.map((item) => (
                  <JourneyCard
                    key={item.stage}
                    stage={item.stage}
                    title={item.title}
                    description={item.description}
                  />
                ))}
              </div>
            </section>

            <section className="mt-16">
              <SectionHeading
                eyebrow="Curriculum"
                title="Course structure"
                text="Your published EDSEC modules appear here when the curriculum has been configured in the learning platform."
              />

              {course.modules.length > 0 ? (
                <div className="mt-8 space-y-4">
                  {course.modules.map((module, index) => (
                    <CurriculumModule
                      key={module.id}
                      number={index + 1}
                      title={module.title}
                      description={module.description}
                      lessons={module.lessons}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-9 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-cyan-600 shadow-sm">
                    <GraduationCap size={27} />
                  </div>

                  <h3 className="mt-5 text-xl font-black text-slate-950">
                    Detailed curriculum coming soon
                  </h3>

                  <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
                    The EDSEC training team is preparing the detailed learning
                    modules for this program.
                  </p>
                </div>
              )}
            </section>

            <section className="mt-16">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white">
                    <Wrench size={23} />
                  </div>

                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.15em] text-cyan-600">
                      Course requirements
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-slate-950">
                      What you need to start
                    </h2>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {requirements.map((requirement) => (
                    <CheckItem key={requirement} text={requirement} />
                  ))}
                </div>
              </div>
            </section>

            {/* CERTIFICATE OF COMPLETION */}
            <section className="relative mt-16 overflow-hidden rounded-[2.5rem] bg-slate-950 px-6 py-14 text-white sm:px-10 sm:py-16 lg:px-12">
              <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
              <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />

              <div className="relative grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-amber-300">
                    <Award size={15} />
                    Certificate of Completion
                  </div>

                  <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                    Complete your training. Earn your certificate.
                  </h2>

                  <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
                    Successfully complete the requirements for{" "}
                    <span className="font-bold text-white">
                      {course.title}
                    </span>{" "}
                    and receive an EDSEC Certificate of Completion
                    recognising {certificateFocus}.
                  </p>

                  <div className="mt-7 rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-5">
                    <div className="flex items-start gap-4">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-400/10 text-cyan-400">
                        <ShieldCheck size={22} />
                      </div>

                      <div>
                        <p className="font-black text-white">
                          Certificate awarded upon successful completion
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          Your certificate represents completed training,
                          practical participation and the skills developed
                          throughout your EDSEC learning journey.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    <CertificateTrustItem
                      title="Training recognition"
                      text="A formal record of your EDSEC course completion."
                    />

                    <CertificateTrustItem
                      title="Career support"
                      text="A useful addition to your CV, portfolio and professional profile."
                    />

                    <CertificateTrustItem
                      title="Course-specific"
                      text={`Issued for your completed ${course.title} program.`}
                    />

                    <CertificateTrustItem
                      title="Verification details"
                      text="Designed with certificate identification information for credibility."
                    />
                  </div>
                </div>

                <div className="relative flex min-h-[360px] items-center justify-center sm:min-h-[430px]">
                  <div className="edsec-certificate-glow absolute h-[78%] w-[78%] rounded-full bg-cyan-400/20 blur-3xl" />

                  <div className="edsec-certificate-float relative w-full max-w-[620px]">
                    <div className="relative mx-auto aspect-[1.414/1] w-full rotate-[-1deg] rounded-[1.2rem] bg-linear-to-br from-amber-200 via-yellow-100 to-amber-300 p-[5px] shadow-[0_35px_90px_rgba(0,0,0,0.5)]">
                      <div className="relative h-full overflow-hidden rounded-[0.9rem] border-[3px] border-amber-700/50 bg-[#fffdf5] text-slate-950">
                        <div className="absolute inset-[9px] rounded-[0.65rem] border border-amber-700/30" />
                        <div className="absolute inset-[15px] rounded-[0.55rem] border border-amber-700/15" />

                        <div className="absolute -right-24 top-[-35%] h-[180%] w-20 rotate-[18deg] bg-white/40 blur-md edsec-certificate-shine" />

                        <div className="relative flex h-full flex-col items-center justify-between px-6 py-5 sm:px-10 sm:py-7">
                          <div className="flex w-full items-start justify-between gap-4">
                            <div className="relative h-14 w-24 sm:h-16 sm:w-28">
                              <Image
                                src={EDSEC_LOGO}
                                alt="EDSEC"
                                fill
                                sizes="112px"
                                className="object-contain object-left"
                              />
                            </div>

                            <div className="text-right">
                              <p className="text-[7px] font-black uppercase tracking-[0.18em] text-slate-500 sm:text-[9px]">
                                EDSEC ICT INSTITUTE
                              </p>

                              <p className="mt-1 text-[7px] font-bold text-cyan-700 sm:text-[9px]">
                                Innovate. Educate. Elevate.
                              </p>
                            </div>
                          </div>

                          <div className="text-center">
                            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-700 sm:text-[11px]">
                              Certificate of Completion
                            </p>

                            <div className="mx-auto mt-2 h-px w-20 bg-amber-700/40 sm:w-32" />

                            <p className="mt-3 text-[7px] font-medium text-slate-500 sm:text-[9px]">
                              This certificate is proudly presented to
                            </p>

                            <p className="mt-1 text-lg font-serif font-black italic text-slate-900 sm:text-2xl">
                              Student Name
                            </p>

                            <p className="mt-2 text-[7px] text-slate-500 sm:text-[9px]">
                              for successfully completing the professional
                              training program in
                            </p>

                            <p className="mt-1 max-w-[360px] text-sm font-black leading-tight text-slate-950 sm:text-xl">
                              {course.title}
                            </p>
                          </div>

                          <div className="flex w-full items-end justify-between gap-4">
                            <div className="text-left">
                              <div className="mb-1 h-px w-20 bg-slate-500/50 sm:w-28" />
                              <p className="text-[6px] font-bold uppercase tracking-wider text-slate-500 sm:text-[8px]">
                                EDSEC Director
                              </p>
                            </div>

                            <div className="edsec-certificate-badge relative grid h-14 w-14 place-items-center rounded-full border-[3px] border-amber-600 bg-linear-to-br from-yellow-100 to-amber-300 shadow-lg sm:h-20 sm:w-20">
                              <div className="absolute inset-1 rounded-full border border-amber-700/50" />
                              <Award
                                size={23}
                                className="text-amber-700 sm:h-8 sm:w-8"
                              />
                              <span className="absolute bottom-1 text-[5px] font-black uppercase tracking-wider text-amber-800 sm:text-[6px]">
                                EDSEC
                              </span>
                            </div>

                            <div className="text-right">
                              <div className="mb-1 ml-auto h-px w-20 bg-slate-500/50 sm:w-28" />
                              <p className="text-[6px] font-bold uppercase tracking-wider text-slate-500 sm:text-[8px]">
                                Date Issued
                              </p>
                            </div>
                          </div>

                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[5px] font-bold uppercase tracking-[0.2em] text-slate-400 sm:bottom-3 sm:text-[7px]">
                            Certificate ID: EDSEC-{course.slug.slice(0, 8).toUpperCase()}-XXXX
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mx-auto mt-[-2px] flex w-[82%] items-center justify-center gap-2 rounded-b-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-xs font-bold text-cyan-300 shadow-xl backdrop-blur-md">
                      <Check size={14} />
                      Certificate awarded upon successful completion
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-16">
              <SectionHeading
                eyebrow="Frequently asked questions"
                title="Questions students often ask"
                text="A few answers to help you understand what to expect before applying."
              />

              <div className="mt-8 space-y-3">
                {visual.faqs.map((faq) => (
                  <FaqItem
                    key={faq.question}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
              <div
                className={`bg-linear-to-br ${visual.accent} p-7 text-white`}
              >
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
                  Course overview
                </p>

                <h3 className="mt-3 text-2xl font-black">{course.title}</h3>

                <p className="mt-3 text-sm leading-6 text-white/80">
                  {visual.tagline}
                </p>

                <div className="mt-6 h-px bg-white/20" />

                <div className="mt-6 space-y-5">
                  <OverviewItem
                    label="Duration"
                    value={displayDuration}
                  />
                  <OverviewItem label="Level" value={visual.level} />
                  <OverviewItem label="Format" value={displayFormat} />
                  <OverviewItem
                    label="Modules"
                    value={`${course.modules.length}`}
                  />
                  <OverviewItem
                    label="Lessons"
                    value={`${totalLessons}`}
                  />

                  {totalMinutes > 0 && (
                    <OverviewItem
                      label="Learning time"
                      value={`${Math.ceil(totalMinutes / 60)}+ hours`}
                    />
                  )}
                </div>
              </div>

              <div className="p-6">
                <Link
                  href={`/apply?course=${encodeURIComponent(course.slug)}`}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-4 font-bold text-white transition hover:bg-cyan-600"
                >
                  Apply Now
                  <ArrowUpRight
                    size={18}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>

                <Link
                  href="/contact"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-4 text-sm font-bold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                >
                  <MessageCircle size={17} />
                  Ask about this course
                </Link>

                <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb
                      size={19}
                      className="mt-0.5 shrink-0 text-cyan-600"
                    />

                    <p className="text-xs leading-5 text-slate-600">
                      Not sure if this is the right program? Contact EDSEC and
                      get guidance before you apply.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-20 text-white sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-400">
                Why learn at EDSEC?
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                Training designed around your growth.
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-400 sm:text-lg">
                EDSEC combines structured teaching, practical exercises,
                project work and career-focused development to help students
                become confident technology users and professionals.
              </p>

              <Link
                href={`/apply?course=${encodeURIComponent(course.slug)}`}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-400"
              >
                Start your application
                <ArrowUpRight size={18} />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <WhyCard
                number="01"
                icon={<Laptop size={22} />}
                title="Hands-On Learning"
                description="Spend time practising skills instead of only listening to theory."
              />

              <WhyCard
                number="02"
                icon={<Rocket size={22} />}
                title="Real Projects"
                description="Build useful work that helps you understand what you are learning."
              />

              <WhyCard
                number="03"
                icon={<TrendingUp size={22} />}
                title="Career Focus"
                description="Connect technical learning to employment, freelance and business opportunities."
              />

              <WhyCard
                number="04"
                icon={<Users size={22} />}
                title="Learning Community"
                description="Learn alongside other students and develop confidence through collaboration."
              />

              <WhyCard
                number="05"
                icon={<Target size={22} />}
                title="Structured Growth"
                description="Progress from foundational concepts toward more challenging practical work."
              />

              <WhyCard
                number="06"
                icon={<Sparkles size={22} />}
                title="Modern Skills"
                description="Develop digital skills relevant to today's technology-driven economy."
              />
            </div>
          </div>
        </div>
      </section>

      {relatedCourses.length > 0 && (
        <section className="px-5 py-20 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-600">
                  Continue learning
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Other programs you may like.
                </h2>
              </div>

              <Link
                href="/courses"
                className="group inline-flex items-center gap-2 font-bold text-cyan-600 transition hover:text-cyan-700"
              >
                View all courses
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {relatedCourses.map((relatedCourse) => {
                const relatedImage =
                  relatedCourse.imageUrl || FALLBACK_IMAGE;

                return (
                  <Link
                    key={relatedCourse.id}
                    href={`/courses/${relatedCourse.slug}`}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl"
                  >
                    <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                      <Image
                        src={relatedImage}
                        alt={relatedCourse.title}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized={isExternalImage(relatedImage)}
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 to-transparent" />
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-black text-slate-950 transition group-hover:text-cyan-600">
                        {relatedCourse.title}
                      </h3>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                        {relatedCourse.shortDescription}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
                        <span className="text-sm font-bold text-slate-500">
                          {relatedCourse.duration || "Flexible"}
                        </span>

                        <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-700 transition group-hover:bg-cyan-500 group-hover:text-white">
                          <ArrowUpRight size={17} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="px-5 pb-20 pt-4 sm:pb-24 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-slate-950 px-7 py-16 text-center text-white sm:px-12 sm:py-20">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="relative mx-auto max-w-3xl">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-cyan-500 text-slate-950 shadow-xl shadow-cyan-950/30">
              <GraduationCap size={30} />
            </div>

            <p className="mt-7 text-sm font-black uppercase tracking-[0.2em] text-cyan-400">
              Your next step starts here
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              Ready to become better at {course.title}?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-300">
              Stop waiting for the perfect time. Start learning, practise your
              skills, build real projects and take the next step toward your
              goals with EDSEC.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={`/apply?course=${encodeURIComponent(course.slug)}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-bold text-slate-950 transition hover:bg-cyan-400"
              >
                Apply for {course.title}
                <ArrowUpRight size={18} />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-4 font-bold text-white transition hover:bg-white/10"
              >
                Talk to EDSEC
                <MessageCircle size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function CourseBadge({
  children,
  cyan = false,
}: {
  children: ReactNode;
  cyan?: boolean;
}) {
  return (
    <span
      className={
        cyan
          ? "rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 backdrop-blur-md"
          : "rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md"
      }
    >
      {children}
    </span>
  );
}

function SectionIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-600">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h2>

      <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
        {text}
      </p>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-600">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h2>

      <p className="mt-3 leading-7 text-slate-600">{text}</p>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  items,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-7">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-cyan-600 shadow-sm">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-black text-slate-950">{title}</h3>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <CheckItem key={item} text={item} />
        ))}
      </div>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cyan-100 text-cyan-700">
        <Check size={14} strokeWidth={3} />
      </span>

      <span className="text-sm font-semibold leading-6 text-slate-700">
        {text}
      </span>
    </div>
  );
}

function ProjectCard({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-sm font-black text-white">
          {number}
        </div>

        <ArrowUpRight
          size={20}
          className="text-slate-300 transition group-hover:text-cyan-600"
        />
      </div>

      <h3 className="mt-7 text-lg font-black text-slate-950">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        A practical project designed to turn course knowledge into something
        you can demonstrate.
      </p>
    </div>
  );
}

function ExperienceCard({
  number,
  title,
}: {
  number: number;
  title: string;
}) {
  return (
    <div className="flex gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-50 text-sm font-black text-cyan-700">
        {String(number).padStart(2, "0")}
      </div>

      <div>
        <h3 className="font-black text-slate-950">{title}</h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Learn through guided practice, feedback and application rather than
          relying on theory alone.
        </p>
      </div>
    </div>
  );
}

function JourneyCard({
  stage,
  title,
  description,
}: {
  stage: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-cyan-50" />

      <div className="relative">
        <span className="inline-flex rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white">
          STAGE {stage}
        </span>

        <h3 className="mt-6 text-xl font-black text-slate-950">{title}</h3>

        <p className="mt-3 text-sm leading-7 text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-cyan-200">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-bold text-slate-900">
        <span>{question}</span>

        <ChevronDown
          size={19}
          className="shrink-0 text-slate-400 transition-transform group-open:rotate-180"
        />
      </summary>

      <p className="mt-4 max-w-3xl pr-8 text-sm leading-7 text-slate-600">
        {answer}
      </p>
    </details>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-slate-100 p-6 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
      <div className="flex items-start gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-600">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-black text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function OverviewItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-5">
      <span className="text-sm text-white/60">{label}</span>

      <span className="max-w-[190px] text-right text-sm font-bold text-white">
        {value}
      </span>
    </div>
  );
}

function CurriculumModule({
  number,
  title,
  description,
  lessons,
}: {
  number: number;
  title: string;
  description: string | null;
  lessons: {
    id: string;
    title: string;
    duration: number | null;
    displayOrder: number;
  }[];
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:border-cyan-200 hover:shadow-lg">
      <div className="flex gap-5 p-6 sm:p-7">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-950 text-sm font-black text-white">
          {String(number).padStart(2, "0")}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
            <h3 className="text-lg font-black text-slate-950">{title}</h3>

            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {lessons.length}{" "}
              {lessons.length === 1 ? "lesson" : "lessons"}
            </span>
          </div>

          {description && (
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {description}
            </p>
          )}
        </div>
      </div>

      {lessons.length > 0 && (
        <div className="border-t border-slate-100 bg-slate-50">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4 last:border-b-0 sm:px-7"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="text-xs font-bold text-slate-400">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="truncate text-sm font-semibold text-slate-700">
                  {lesson.title}
                </span>
              </div>

              {lesson.duration !== null && lesson.duration > 0 && (
                <span className="shrink-0 text-xs font-medium text-slate-400">
                  {lesson.duration} min
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WhyCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.07]">
      <div className="flex items-center justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-400/10 text-cyan-400">
          {icon}
        </div>

        <span className="text-xs font-black text-slate-600">{number}</span>
      </div>

      <h3 className="mt-6 text-lg font-black text-white">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}

function CertificateTrustItem({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cyan-400/10 text-cyan-400">
          <Check size={15} strokeWidth={3} />
        </span>

        <div>
          <p className="text-sm font-black text-white">{title}</p>

          <p className="mt-1 text-xs leading-5 text-slate-400">{text}</p>
        </div>
      </div>
    </div>
  );
}