import Head from 'next/head'
import { AiFillLinkedin, AiFillGithub, AiFillInstagram } from 'react-icons/ai';
import { useState, useEffect, useRef } from "react";
import { Link } from 'react-scroll';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });
  const canvasRef = useRef(null);

  const physicsMouse = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      physicsMouse.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      physicsMouse.current = { x: -999, y: -999 };
    };

    window.addEventListener('mousemove', handleMouse);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      baseOpacity: Math.random() * 0.5 + 0.2
    }));

    let animId;
    
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const mouseX = physicsMouse.current.x;
      const mouseY = physicsMouse.current.y;
      const interactionRadius = 150;

      particles.forEach(p => {
        const dxMouse = mouseX - p.x;
        const dyMouse = mouseY - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < interactionRadius) {
          const force = (interactionRadius - distMouse) / interactionRadius;
          p.x -= (dxMouse / distMouse) * force * 2;
          p.y -= (dyMouse / distMouse) * force * 2;
          p.opacity = Math.min(p.baseOpacity + 0.5, 1);

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          
          ctx.strokeStyle = `rgba(125, 211, 252, ${0.2 * (1 - distMouse / interactionRadius)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          if (p.opacity > p.baseOpacity) {
            p.opacity -= 0.01; 
          }
        }

        p.x += p.dx; 
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(125, 211, 252, ${p.opacity})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
         
        }
      }
      animId = requestAnimationFrame(draw);
    }
    
    draw();

    const resize = () => { 
      canvas.width = window.innerWidth; 
      canvas.height = window.innerHeight; 
    };
    window.addEventListener('resize', resize);
    
    return () => { 
      cancelAnimationFrame(animId); 
      window.removeEventListener('resize', resize); 
    };
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);

 const categoryLabels = [
  'All',
  'Languages',
  'Frontend',
  'Backend',
  'DevOps & Cloud',
  'Game Engine & Hardware'
];

const skills = [
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', categories: ['Languages'] },
  { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', categories: ['Languages'] },
  { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', categories: ['Languages'] },
  { name: 'SQL', icon: '/skills/sql.svg', needsInvert: true, categories: ['Languages'] },
  { name: 'SQLite', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg', categories: ['Backend'] },
  { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', categories: ['Backend'] },
  { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', categories: ['Backend'] },
  { name: 'Flask', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg', needsInvert: true, categories: ['Backend'] },
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', categories: ['DevOps & Cloud'] },
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', categories: ['Frontend'] },
  { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', categories: ['Backend'] },
  { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', needsInvert: true, categories: ['Backend'] },
  { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', categories: ['Frontend'] },
  { name: 'C++', icon: '/skills/C++.svg', categories: ['Languages'] },
  { name: 'C', icon: '/skills/C.svg', categories: ['Languages'] },
  { name: 'RESTful API', icon: 'https://img.icons8.com/?size=50&id=21888&format=png', needsInvert: true, categories: ['Backend'] },
  { name: 'Bootstrap', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg', categories: ['Frontend'] },
  { name: 'Tailwind', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', categories: ['Frontend'] },
  { name: 'Material UI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg', categories: ['Frontend'] },
  { name: 'Three.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg', needsInvert: true, categories: ['Frontend'] },
  { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', categories: ['DevOps & Cloud'] },
  { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', categories: ['Frontend'] },
  { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', categories: ['Frontend'] },
  { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', categories: ['Backend'] },
  { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', categories: ['Languages'] },
  { name: 'Dart', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg', categories: ['Languages'] },
  { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg', categories: ['Frontend'] },
  { name: 'Arduino', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg', categories: ['Game Engine & Hardware'] },
  { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg', categories: ['Backend', 'DevOps & Cloud'] },
  { name: 'Godot', icon: 'https://godotengine.org/assets/press/icon_color.png', categories: ['Game Engine & Hardware'] },
  { name: 'FastAPI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg', categories: ['Backend'] },
  { name: 'Socket.IO', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg', needsInvert: true, categories: ['Backend'] },
  { name: 'AWS Bedrock', icon: '/skills/Bedrock.svg', categories: ['DevOps & Cloud'] },
  { name: 'AWS S3', icon: 'https://user-images.githubusercontent.com/15157491/75435753-6929fc80-594b-11ea-9e19-f78223916862.png', categories: ['DevOps & Cloud'] },
  { name: 'Puppeteer', icon: 'https://www.svgrepo.com/show/354228/puppeteer.svg', categories: ['Backend'] },
  { name: 'Cheerio', icon: '/skills/cheerio.svg', categories: ['Backend'] },
  { name: 'Drei', icon: 'https://pmndrs.gallerycdn.vsassets.io/extensions/pmndrs/pmndrs/0.3.7/1676328524141/Microsoft.VisualStudio.Services.Icons.Default', categories: ['Frontend'] },
  { name: 'PXE', icon: '/skills/pxe.svg', categories: ['Game Engine & Hardware'] },
  { name: 'Linux', icon: '/skills/linux.svg', categories: ['DevOps & Cloud'] },
  { name: 'Bash', icon: '/skills/bash.svg', needsInvert: true, categories: ['Languages', 'DevOps & Cloud'] },
];

  const experience = [
    {
      company: 'CITRIS and the Banatao Institute',
      role: 'Full-Stack Developer Intern',
      period: 'May 2025 – Aug 2025',
      location: 'Remote',
      color: 'from-sky-400 to-cyan-500',
      bullets: [
        'Developing a media web platform with Tiny Health Tales and tooling for creation of health flyers.',
        'Designing accessible UI/UX and MERN stack for efficient storage of media.',
        'Participating in CITRIS workshops focused on professional skills, tech innovation, and public-interest technology.',
      ],
    },
    {
      company: 'X10e',
      role: 'Full-Stack Developer Intern – LLM Model for Health Data',
      period: 'Jan 2025 – May 2025',
      location: 'Remote',
      color: 'from-cyan-400 to-teal-500',
      bullets: [
        'Developed an AI-powered mobile health assistant integrating simulated biosensor data with a LLM.',
        'Built a retrieval-augmented generation (RAG) pipeline using AWS to analyze biomarkers from 20+ research papers.',
        'Delivered a cross-platform Flutter app with real-time health data visualization and multi-device support.',
      ],
    },
    {
      company: 'Tiny Health Tales',
      role: 'Frontend Web Developer',
      period: 'Dec 2023 – Aug 2024',
      location: 'Remote',
      color: 'from-blue-300 to-sky-500',
      bullets: [
        'Designed and developed a responsive website from scratch using React and TypeScript for health education outreach.',
        'Produced user-friendly interfaces reaching ~40 users in the San Joaquin Valley.',
        'Collaborated with team members to prepare the platform for future media integration.',
      ],
    },
    {
      company: 'Igniteducation',
      role: 'Frontend & Mobile Web Developer Intern',
      period: 'Nov 2020 – Jul 2021',
      location: 'Remote',
      color: 'from-teal-400 to-emerald-500',
      bullets: [
        'Redesigned the company website using HTML, CSS, Bootstrap, and WordPress, improving mobile responsiveness by 30%.',
        'Enhanced mobile accessibility by adjusting visual elements for smaller screens.',
        'Utilized Photoshop to redesign logos and enhance visual consistency across pages.',
      ],
    },
  ];

  const projects = [
    {
      title: 'Portfolio Website',
      description: 'Personal portfolio built with Next.js, React, and Tailwind CSS. Implemented native Canvas API particles that react to user touch and mouse movements, creating an immersive underwater Pokémon theme. The entire experience is fully responsive, ensuring the same playful, animated UI works perfectly on mobile devices as it does on desktop.',
      tags: ['React', 'Next.js', 'Tailwind'],
      color: 'from-sky-400 to-cyan-500',
      tagColor: 'from-sky-800 to-cyan-900',
      image: '/projects/portfolio.png',
      link: 'https://github.com/wtrantan/react-portfolio',
    },
    {
      title: 'KarimeRank',
      description: 'A responsive K-pop idol card ranking application powered by an Elo system. Features interactive visual effects and robust data integration capable of handling approximately 10,000 daily high-volume API requests.',
      tags: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Firebase', 'Tailwind CSS', 'JSON Web Token', 'Cheerio', 'Puppeteer', 'JavaScript', 'API Integration', 'UI/UX'],
      color: 'from-sky-400 to-cyan-500',
      tagColor: 'from-sky-800 to-cyan-900',
      image: '/projects/Cover.png',
      link: 'https://karime-rank.vercel.app/',
    },
    {
      title: 'Chat & Chill',
      description: 'A winter-themed multiplayer web game featuring real-time chat, snowball mechanics, and rarity-based fishing within randomly generated shared lobbies, seamlessly supporting up to 8 concurrent players.',
      tags: ['Socket.IO', 'Express.js', 'SQLite', 'WebSockets'],
      color: 'from-sky-400 to-cyan-500',
      tagColor: 'from-sky-800 to-cyan-900',
      image: '/projects/penguin.png',
      link: 'https://cse108-project-shooter-game.onrender.com/',
    },
    {
      title: 'Ultrasonic Sensor Detection',
      description: 'Designed and built an Arduino-based system using an HC-SR04 ultrasonic sensor to detect and count individuals passing through an entrance; displayed results in real-time on an LCD.',
      tags: ['C++', 'Arduino', 'Circuits'],
      color: 'from-sky-400 to-cyan-500',
      tagColor: 'from-sky-800 to-cyan-900',
      image: '/projects/circuit.jpg',
      link: 'https://www.youtube.com/watch?v=i7fmPf5KST4',
    },
    {
      title: 'KarinaSys',
      description: 'An introductory exploration of 3D web development with Three.js, demonstrating the fundamentals of manipulating geometries, lighting, and camera perspectives within a digital space.',
      tags: ['Three.js'],
      color: 'from-sky-400 to-cyan-500',
      tagColor: 'from-sky-800 to-cyan-900',
      image: '/projects/karinasys.png',
      link: 'https://karinasys.vercel.app/',
    },
    {
      title: 'Cauldron Creates',
      description: 'A full-stack recipe generation application that utilizes AI to instantly brew healthy, step-by-step meals based on whatever ingredients users currently have on hand.',
      tags: ['React', 'Node.js', 'Express.js', 'MySQL', 'openAI API'],
      color: 'from-sky-400 to-cyan-500',
      tagColor: 'from-sky-800 to-cyan-900',
      image: '/projects/cauldron.png',
      link: 'https://github.com/wtrantan/HackDavis',
    },
    {
      title: 'Profit Prophet',
      description: 'An AI-powered personal finance assistant that integrates secure banking data to analyze transactions and deliver personalized budgeting advice.',
      tags: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Gemini API'],
      color: 'from-sky-400 to-cyan-500',
      tagColor: 'from-sky-800 to-cyan-900',
      image: '/projects/profit.jpg',
      link: 'https://github.com/Pyroniam/Hackathon_2025',
    },
  ];

  
  const MOBILE_LIMIT = 12;
 
  const [showAll, setShowAll] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="bg-[#061923] text-white font-sans overflow-x-hidden w-full">
      <Head>
        <title>William Trantan — Portfolio</title>
        <meta name="google-site-verification" content="google-site-verification=apAeanNEg0W0UhOKRViX7ROlm-zTqCZA4n-CoLWobM4" />
        <meta name="description" content="William Trantan — Test Engineer & Developer" />

        {/* Open Graph properties */}
        <meta property="og:title" content="William Trantan — Portfolio" />
        <meta property="og:description" content="William Trantan — Test Engineer & Developer" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://williamtrantan.com" />
        <meta property="og:image" content="https://williamtrantan.com/OG_image.png" />

        <meta name="twitter:card" content="summary_large_image" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />
      </Head>

      {/* Cursor glow — desktop only */}
      <div
        className="fixed pointer-events-none z-50 w-64 h-64 rounded-full hidden md:block"
        style={{
          left: mousePos.x - 128,
          top: mousePos.y - 128,
          background: 'radial-gradient(circle, rgba(125,211,252,0.12) 0%, transparent 70%)',
          willChange: 'left, top',
        }}
      />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-40"
        style={{ background: 'rgba(6,25,35,0.84)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(125,211,252,0.14)' }}>
        <div className="flex items-center justify-between px-4 sm:px-8 py-4">
          <span className="font-['Archivo_Black'] font-extrabold text-lg tracking-widest text-sky-200 uppercase">WT</span>

          {/* Desktop links */}
          <ul className="hidden md:flex gap-1">
            {['Home', 'About', 'Experience', 'Projects', 'Skills'].map(item => (
              <li key={item}>
                <Link
                  to={item.toLowerCase()}
                  spy smooth offset={-72} duration={700}
                  onSetActive={() => setActiveSection(item.toLowerCase())}
                  className={`cursor-pointer px-4 py-2 rounded-full font-['DM_Sans'] text-sm font-medium transition-all duration-300
                    ${activeSection === item.toLowerCase()
                      ? 'bg-sky-500/80 text-white shadow-lg shadow-sky-400/25'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 cursor-pointer"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle menu">
            <span className={`block w-6 h-0.5 bg-sky-200 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-sky-200 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-sky-200 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile dropdown */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
          <ul className="flex flex-col px-4 gap-1">
            {['Home', 'About', 'Experience', 'Projects', 'Skills'].map(item => (
              <li key={item}>
                <Link
                  to={item.toLowerCase()}
                  spy smooth offset={-72} duration={700}
                  onSetActive={() => setActiveSection(item.toLowerCase())}
                  onClick={() => setMenuOpen(false)}
                  className={`block cursor-pointer px-4 py-3 rounded-xl font-['DM_Sans'] text-sm font-medium transition-all duration-200
                    ${activeSection === item.toLowerCase()
                      ? 'bg-sky-400/15 text-sky-200 border border-sky-300/25'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="home" name="home" className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-16 w-full box-border">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 left-[15%] w-28 h-[70%] opacity-[0.07] blur-2xl rounded-full rotate-[6deg]"
            style={{ background: '#a8e6ff' }} />
          <div className="absolute -top-10 left-[30%] w-10 h-[60%] opacity-[0.12] blur-xl rounded-full rotate-[2deg]"
            style={{ background: '#d4f4ff' }} />
          <div className="absolute -top-10 left-[48%] w-32 h-[65%] opacity-[0.06] blur-3xl rounded-full rotate-[-3deg]"
            style={{ background: '#b0eaff' }} />
          <div className="absolute -top-10 left-[63%] w-8 h-[55%] opacity-[0.10] blur-lg rounded-full rotate-[5deg]"
            style={{ background: '#c8f0ff' }} />
          <div className="absolute -top-10 left-[76%] w-24 h-[60%] opacity-[0.07] blur-2xl rounded-full rotate-[-2deg]"
            style={{ background: '#a8e6ff' }} />
        </div>
        
        <div className="absolute bottom-1/3 right-1/4 w-56 sm:w-80 h-56 sm:h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #5eead4, transparent)' }} />

        <div className="relative z-10 text-center w-full max-w-3xl mx-auto px-4">
          {/* Avatar */}
          <div className="relative inline-block mb-8">
            <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full mx-auto overflow-hidden ring-4 ring-sky-300/40 shadow-2xl shadow-sky-300/20" 
              style={{ background: 'linear-gradient(135deg, #7dd3fc, #5eead4)' }}>
              <img src="/pfp.png" alt="William Trantan" className="w-full h-full object-cover " />
            </div>
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-teal-300 rounded-full border-2 border-[#061923] shadow-lg shadow-teal-300/40" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-sky-950/45 border border-sky-300/30 text-sky-200 text-[10px] sm:text-xs font-['DM_Sans'] tracking-widest uppercase px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-5 sm:mb-6">
            <span className="w-1.5 h-1.5 bg-teal-300 rounded-full animate-pulse shrink-0" />
            Test Engineer · Quanta · UC Merced &apos;25
          </div>

          <h1 className="font-['Archivo_Black'] font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none mb-5 sm:mb-6 pb-2"
            style={{ background: 'linear-gradient(135deg, #f8fdff 0%, #bae6fd 58%, #5eead4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            William<br />Trantan
          </h1>

          <p className="font-['DM_Sans'] font-light text-gray-400 text-sm sm:text-base md:text-lg max-w-sm sm:max-w-md mx-auto mb-7 sm:mb-8 leading-relaxed">
            Passionate about coding, hockey, and bridging the gaps between imagination and reality.
            Simply someone building cool digital experiences.
           
          </p>
            
          {/* Social links */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-7 sm:mb-8 flex-wrap">
            {[
              { icon: <AiFillGithub />, href: 'https://github.com/wtrantan', label: 'GitHub', grad: 'from-gray-600 to-gray-800' },
              { icon: <AiFillLinkedin />, href: 'https://www.linkedin.com/in/wtrantan/', label: 'LinkedIn', grad: 'from-blue-600 to-blue-800' },
              { icon: <AiFillInstagram />, href: 'https://www.instagram.com/w_trantan/', label: 'Instagram', grad: 'from-pink-600 to-fuchsia-800' },
            ].map(({ icon, href, label, grad }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                className={`group flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r ${grad} border border-white/10 text-xs sm:text-sm font-['DM_Sans'] font-medium text-gray-300 hover:text-white transition-all duration-200 hover:scale-105 hover:shadow-lg`}>
                <span className="text-base sm:text-xl">{icon}</span>
                {label}
              </a>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex justify-center gap-3 flex-wrap">
            <Link to="projects" spy smooth offset={-72} duration={700}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full font-['Archivo_Black'] font-bold text-xs sm:text-sm tracking-wide
                border border-sky-300/40 text-sky-200 hover:bg-sky-950/40 hover:border-sky-200 transition-all duration-200 hover:scale-105">
                  Projects ↓
            </Link>
            <a href="/resume.pdf" target="_blank"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full font-['Archivo_Black'] font-bold text-xs sm:text-sm tracking-wide
                border border-sky-300/40 text-sky-200 hover:bg-sky-950/40 hover:border-sky-200 transition-all duration-200 hover:scale-105">
              Résumé ↗
            </a>
          </div>
        </div>

        <div
  className="absolute pointer-events-none md:-left-12 lg:left-[25%] xl:left-[55%]"
  style={{
    top: '40%',
    transform: 'translateY(-50%)',
    zIndex: 0,
    width: '820px',
    animation: 'whaleFloat 7s ease-in-out infinite',
  }}
>
  <img
    src="/wailord1.png"
    alt="Wailord"
    style={{
      transform:'rotate(15deg)',
      width: '100%',
      opacity: 0.32,
      filter: 'contrast(1.4) brightness(1.2) drop-shadow(0 0 5px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 12px rgba(94, 234, 212, 0.4)) drop-shadow(0 0 40px rgba(125, 211, 252, 0.5))',
    }}
  />
</div>
{/* Lugia and Flanking Lines */}
<div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
  
  {/* Left Line — Uses custom responsive offset */}
  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-sky-400/25 to-sky-400/10 ml-8 sm:ml-24 lugia-line-offset" />

  {/* Centered Lugia Container */}
  <div className="relative lugia-float flex-shrink-0 px-4">
    <img
      src="/lugia1.png"
      alt="Lugia"
      className="lugia-img"
      style={{
        opacity: 0.42,
        filter: 'contrast(1.4) brightness(1.2) drop-shadow(0 0 5px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 12px rgba(94, 234, 212, 0.4)) drop-shadow(0 0 40px rgba(125, 211, 252, 0.5))',
      }}
    />
  </div>

  {/* Right Line — Uses custom responsive offset */}
  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-sky-400/25 to-sky-400/10 mr-8 sm:mr-24 lugia-line-offset" />
  
</div>
      </section>

    

      {/* ── ABOUT ── */}
      <section id="about" name="about" className="relative min-h-screen flex items-center px-4 sm:px-6 py-24 sm:py-32 w-full ">
        
        <div className="absolute top-20 right-0 w-48 sm:w-72 h-48 sm:h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #38bdf8, transparent)' }} />

        <div className="max-w-5xl mx-auto w-full z-10">
          <div className="mb-10 sm:mb-16">
            <span className="font-['DM_Sans'] text-xs tracking-[0.3em] uppercase text-sky-300 mb-3 block">About</span>
            <h2 className="font-['Archivo_Black'] font-extrabold text-4xl sm:text-5xl md:text-6xl text-white">Who I am</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 items-center">
            {/* Photo */}
            <div className="relative ">
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 mx-auto ">
                <div className="absolute inset-0 rounded-3xl rotate-3"
                  style={{ background: 'linear-gradient(135deg, #7dd3fc33, #5eead433)', border: '1px solid rgba(125,211,252,0.24)' }} />
                <div className="absolute inset-0 rounded-3xl overflow-hidden -rotate-1 ring-1 ring-sky-300/25 ">
                  <img src="/me.jpg" alt="William" className="w-full h-full object-cover " />
                </div>
                <div className="absolute -bottom-3 -right-2 sm:-right-3 bg-[#092838] border border-sky-300/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 shadow-xl">
                  <p className="font-['Syne'] font-bold text-sky-200 text-xs sm:text-sm ">Test Engineer</p>
                  <p className="font-['DM_Sans'] text-gray-500 text-xs">Quanta</p>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="mt-10 lg:mt-0  ">
              <p className="font-['DM_Sans'] font-light text-gray-300 text-base sm:text-lg leading-relaxed mb-5 sm:mb-6">
                  Born in <span className="text-sky-200 font-medium">Minnesota</span>, raised in <span className="text-sky-200 font-medium">San Jose</span>.
                  I graduated from UC Merced with a B.S. in Computer Science & Engineering, driven by a lifelong passion for building
                  things with code. I&apos;m passionate about software development and always seeking opportunities to grow as a programmer, whether through fun side projects or building polished software. Ultimately, I aim to create work that bridges the gap between humans and technology.
              </p>
              <p className="font-['DM_Sans'] font-light text-gray-400 text-sm sm:text-base leading-relaxed mb-7 sm:mb-8">
                Outside of engineering, I spend time ice skating, watching hockey,
                going hiking, swimming or playing video games. I make sure to keep myself active and healthy while away from the computer.
              </p>
              <div className="flex flex-wrap gap-2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" name="experience" className="relative px-4 sm:px-6 py-24 sm:py-32 w-full">
        <div className="absolute top-20 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7dd3fc, transparent)' }} />

        <div className="max-w-3xl mx-auto">
          <div className="mb-10 sm:mb-16">
            <span className="font-['DM_Sans'] text-xs tracking-[0.3em] uppercase text-sky-300 mb-3 block">Experience</span>
            <h2 className="font-['Archivo_Black'] font-extrabold text-4xl sm:text-5xl md:text-6xl text-white">Where I&apos;ve worked</h2>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-sky-400 via-cyan-700 to-transparent ml-[7px] hidden sm:block" />

            <div className="flex flex-col gap-10 sm:gap-12">
              {experience.map((job, i) => (
                <div key={i} className="group relative flex gap-6 sm:gap-8">
                  <div className="hidden sm:flex flex-col items-center shrink-0 mt-1">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${job.color} ring-4 ring-[#061923] group-hover:scale-125 transition-transform duration-300`} />
                  </div>

                  <div className="flex-1 rounded-2xl border border-white/5 hover:border-sky-300/25 bg-white/[0.03] hover:bg-white/[0.045] p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-sky-950/20">
                    <div className={`h-0.5 w-10 rounded-full bg-gradient-to-r ${job.color} mb-4 group-hover:w-full transition-all duration-500`} />

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 mb-1">
                      <h3 className="font-extrabold text-lg sm:text-xl text-white leading-tight">{job.company}</h3>
                      <span className="font-['DM_Sans'] text-xs text-sky-200 bg-sky-950/45 border border-sky-700/40 px-3 py-1 rounded-full shrink-0 self-start">{job.period}</span>
                    </div>

                    <p className={`font-['DM_Sans'] font-medium text-sm bg-gradient-to-r ${job.color} bg-clip-text text-transparent mb-1`}>{job.role}</p>
                    <p className="font-['DM_Sans'] text-xs text-gray-600 mb-4">{job.location}</p>

                    <ul className="flex flex-col gap-2">
                      {job.bullets.map((b, j) => (
                        <li key={j} className="flex gap-2 items-start">
                          <span className="text-sky-300 mt-1 shrink-0 text-xs">▹</span>
                          <span className="font-['DM_Sans'] font-light text-gray-400 text-sm leading-relaxed">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="absolute pointer-events-none hidden md:block"
          style={{
            left: '67%',
            top: '30%',
            transform: 'translateY(-50%)',
            zIndex: 0,
            width: '720px',
            animation: 'whaleFloat 7s ease-in-out infinite',
          }}
        >
          <img
            src="/kyogre3.png"
            alt=""
            style={{
              width: '100%',
              opacity: 0.22,
              filter: `contrast(1.4) brightness(1.2) drop-shadow(0 0 4px rgba(255, 180, 200, 0.9)) drop-shadow(0 0 15px rgba(220, 38, 38, 0.7)) drop-shadow(0 0 45px rgba(124, 58, 237, 0.5)) drop-shadow(0 0 100px rgba(14, 165, 233, 0.3))
              `,
            }}
          />
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" name="projects" className="relative min-h-screen px-4 sm:px-6 py-24 sm:py-32 w-full">
        <div className="absolute bottom-20 left-0 w-64 sm:w-80 h-64 sm:h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #5eead4, transparent)' }} />

        <div className="max-w-5xl mx-auto">
          <div className="mb-10 sm:mb-16">
            <span className="font-['DM_Sans'] text-xs tracking-[0.3em] uppercase text-sky-300 mb-3 block">Work</span>
            <h2 className="font-['Archivo_Black'] font-extrabold text-4xl sm:text-5xl md:text-6xl text-white">Projects</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
            {projects.map((p, i) => (
              <a key={i} href={p.link} target="_blank" rel="noreferrer"
                className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-sky-300/30 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-950/25 cursor-pointer flex flex-col">

                <div className="relative w-full h-44 sm:h-48 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-20 z-10`} />
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#082433] to-transparent z-20" />
                </div>

                <div className="flex-col flex-1 p-5 sm:p-6">
                  <div className={`h-0.5 w-10 rounded-full bg-gradient-to-r ${p.color} mb-4 group-hover:w-full transition-all duration-500`} />
                  <h3 className="font-['Archivo_Black'] font-bold text-lg sm:text-xl text-white mb-2">{p.title}</h3>
                  <p className="font-['DM_Sans'] font-light text-gray-400 text-sm leading-relaxed mb-5 flex-1">{p.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map(t => (
                      <span key={t} className={`text-xs font-['DM_Sans'] px-3 py-1 rounded-full bg-gradient-to-r ${p.tagColor} text-white border border-white/10`}>{t}</span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* GitHub CTA */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-4 sm:gap-5 p-8 sm:p-10 rounded-3xl border border-sky-700/30 bg-sky-950/20 w-full sm:w-auto">
              <AiFillGithub className="text-5xl sm:text-6xl text-sky-300" />
              <div className="text-center">
                <p className="font-['Archivo_Black'] font-bold text-lg sm:text-xl text-white mb-1">See everything on GitHub</p>
                <p className="font-['DM_Sans'] text-gray-500 text-sm">More projects, contributions, and experiments</p>
              </div>
              <a href="https://github.com/wtrantan" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full font-['Archivo_Black'] font-bold text-xs sm:text-sm tracking-wide
                border border-sky-300/40 text-sky-200 hover:bg-sky-950/40 hover:border-sky-200 transition-all duration-200 hover:scale-105">
                GitHub ↗
              </a>
            </div>
          </div>
        </div>

        <div
          className="absolute pointer-events-none hidden md:block"
          style={{
            left: '0%',
            top: '30%',
            transform: 'translateY(-50%)',
            zIndex: 0,
            width: '520px',
            animation: 'whaleFloat 7s ease-in-out infinite',
          }}
        >
          <img
            src="/squirtle2.png"
            alt=""
            style={{
              width: '100%',
              opacity: 0.22,
              filter: 'contrast(1.4) brightness(1.2) drop-shadow(0 0 5px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 12px rgba(94, 234, 212, 0.4)) drop-shadow(0 0 40px rgba(125, 211, 252, 0.5))',
            }}
          />
        </div>
      </section>

  {/* ── SKILLS SECTION ── */}
<section
  id="skills"
  name="skills"
  className="relative min-h-screen flex flex-col items-center py-20 sm:py-32 px-4 sm:px-6 border-y border-sky-900/30 overflow-hidden w-full"
  style={{ background: 'rgba(14,116,144,0.05)' }}
>
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: 'radial-gradient(rgba(125,211,252,0.12) 1px, transparent 1px)',
      backgroundSize: '32px 32px',
    }}
  />

  <div className="max-w-5xl w-full mx-auto relative z-10">

    {/* Header */}
    <div className="text-center mb-10 sm:mb-12">
      <span className="font-['DM_Sans'] text-xs tracking-[0.3em] uppercase text-sky-300 mb-3 block">
        Technologies I&apos;ve used so far
      </span>
      <h2 className="font-['Archivo_Black'] font-extrabold text-3xl sm:text-4xl md:text-5xl text-white">
        Tech Stack
      </h2>
    </div>

    {/* Category Tabs */}
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-14">
      {categoryLabels.map((label) => (
        <button
          key={label}
          onClick={() => setActiveCategory(label)}
          className={`font-['DM_Sans'] text-xs sm:text-sm tracking-[0.15em] uppercase px-4 sm:px-5 py-2 rounded-full border transition-all duration-300
            ${activeCategory === label
              ? 'bg-sky-500/20 border-sky-400 text-white'
              : 'border-sky-900/50 text-gray-400 hover:border-sky-700 hover:text-sky-300'
            }`}
        >
          {label}
        </button>
      ))}
    </div>

    {/* Desktop Grid */}
    <div className="hidden lg:flex lg:flex-wrap justify-center gap-x-8 gap-y-10 2xl:gap-x-10 2xl:gap-y-14">
      {skills.map(({ name, icon, needsInvert, categories }) => {
        const isCategoryMatch = activeCategory === 'All' || categories.includes(activeCategory);
        return (
          <div key={name} className={`group flex-col items-center gap-2 2xl:gap-3 w-16 2xl:w-20 ${isCategoryMatch ? 'flex' : 'hidden'}`}>
            <img
              src={icon}
              alt={name}
              className={`w-12 h-12 lg:w-14 lg:h-14 object-contain transition-all duration-300
                ${needsInvert ? 'brightness-0 invert' : ''}
                group-hover:scale-110 group-hover:-translate-y-1`}
            />
            <span className="font-['DM_Sans'] text-xs 2xl:text-sm text-gray-400 text-center transition-colors duration-300 group-hover:text-sky-300">
              {name}
            </span>
          </div>
        );
      })}
    </div>

    {/* Mobile & Tablet Grid */}
    <div className="lg:hidden w-full">
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-y-8 gap-x-3 sm:gap-x-6 justify-items-center">
        {skills.map(({ name, icon, needsInvert, categories }, index) => {
          const isCategoryMatch = activeCategory === 'All' || categories.includes(activeCategory);
          const isOverMobileLimit = activeCategory === 'All' && !showAll && index >= MOBILE_LIMIT;
          const shouldShow = isCategoryMatch && !isOverMobileLimit;

          return (
            <div key={name} className={`group flex-col items-center gap-1.5 sm:gap-2 ${shouldShow ? 'flex' : 'hidden'}`}>
              <img
                src={icon}
                alt={name}
                className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain transition-all duration-300
                  ${needsInvert ? 'brightness-0 invert' : ''}
                  group-hover:scale-110 group-hover:-translate-y-1`}
              />
              <span className="font-['DM_Sans'] text-[10px] sm:text-xs text-gray-400 text-center transition-colors duration-300 group-hover:text-sky-300">
                {name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Show All Toggle */}
      {activeCategory === 'All' && skills.length > MOBILE_LIMIT && (
        <div className="text-center mt-10 sm:mt-12">
          <button
            onClick={() => setShowAll(prev => !prev)}
            className="font-['DM_Sans'] text-xs sm:text-sm tracking-[0.2em] uppercase text-sky-300 border border-sky-700/50 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 hover:bg-sky-900/30 transition-all duration-300 hover:border-sky-400 hover:text-white"
          >
            {showAll ? 'Show less ↑' : `Show all ${skills.length} ↓`}
          </button>
        </div>
      )}
    </div>

  </div>
</section>

      {/* ── FOOTER ── */}
      <footer className="relative overflow-hidden border-t border-sky-900/25 pt-14 pb-10 sm:pt-16 sm:pb-12 text-center px-4">
  <div className="relative z-10 flex flex-col items-center gap-2">
    <p className="font-['DM_Sans'] text-sky-100/60 text-xs sm:text-sm">
      © 2026 William Trantan
    </p>
    
    <p className="font-['DM_Sans'] text-sky-100/40 text-[10px] sm:text-xs max-w-2xl leading-relaxed">
      Lugia art by <a href="https://www.redbubble.com/shop/ap/128560162" target="_blank" rel="noopener noreferrer" className="hover:text-sky-200 transition-colors underline decoration-sky-900">DarkIndigo</a> • 
      Kyogre art by <a href="https://www.pixiv.net/en/users/26820771/artworks" target="_blank" rel="noopener noreferrer" className="hover:text-sky-200 transition-colors underline decoration-sky-900">Tanami</a> • 
      Wailord & Squirtle art by unknown (via Pinterest)
    </p>
  </div>
</footer>

      <style>{`
        @keyframes whaleFloat {
          0%, 100% { transform: translateY(-50%) translateY(0px)   rotate(-1deg); }
          50%       { transform: translateY(-50%) translateY(18px)  rotate(1.5deg); }
        }
      `}</style>
    </div>
  );
}