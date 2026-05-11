import Head from 'next/head'
import { AiFillLinkedin, AiFillGithub, AiFillInstagram } from 'react-icons/ai';
import { useState, useEffect, useRef } from "react";
import { Link } from 'react-scroll';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });
  const canvasRef = useRef(null);

  
// NEW: We use a mutable ref for the physics engine to read instantly
  const physicsMouse = useRef({ x: -999, y: -999 });

  useEffect(() => {
    // 1. Sync React state (for custom cursor) with Physics Ref (for canvas)
    const handleMouse = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      physicsMouse.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      physicsMouse.current = { x: -999, y: -999 }; // Move particles off-screen
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
    
    // Set explicit dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles with slightly higher density and varied speeds
    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      baseOpacity: Math.random() * 0.5 + 0.2 // Store base to restore after hover
    }));

    let animId;
    
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const mouseX = physicsMouse.current.x;
      const mouseY = physicsMouse.current.y;
      const interactionRadius = 150; // How close the mouse needs to be to affect them

      particles.forEach(p => {
        // --- 1. MOUSE INTERACTION PHYSICS ---
        const dxMouse = mouseX - p.x;
        const dyMouse = mouseY - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < interactionRadius) {
          // Repulsion force: particles push away from the cursor
          const force = (interactionRadius - distMouse) / interactionRadius;
          
          // Push particles away
          p.x -= (dxMouse / distMouse) * force * 2;
          p.y -= (dyMouse / distMouse) * force * 2;
          
          // Brighten particles when near cursor
          p.opacity = Math.min(p.baseOpacity + 0.5, 1);

          // Draw "spiderweb" line connecting cursor to particle
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(167, 139, 250, ${0.2 * (1 - distMouse / interactionRadius)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          // Gradually return to normal opacity when mouse leaves
          if (p.opacity > p.baseOpacity) {
            p.opacity -= 0.01; 
          }
        }

        // --- 2. STANDARD MOVEMENT ---
        p.x += p.dx; 
        p.y += p.dy;

        // Bounce off walls smoothly
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        // --- 3. DRAW PARTICLE ---
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${p.opacity})`;
        ctx.fill();
      });

      // --- 4. CONNECT NEARBY PARTICLES ---
      // (Optimized connection logic)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(167, 139, 250, ${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }
    
    draw();

    // Handle Window Resize properly
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
  const skills = [
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'Python',     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'SQL',        icon: 'https://www.freeiconspng.com/uploads/sql-server-icon-png-29.png' },
    { name: 'SQLite',     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg' },
    { name: 'MySQL',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
    { name: 'Flask',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg', needsInvert: true  },
    { name: 'Git',        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg'},
    { name: 'React',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Node.js',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'Express',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', needsInvert: true },
    { name: 'Next.js',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
    { name: 'C++',        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
    { name: 'C',          icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
    { name: 'RESTful API', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
    { name: 'Bootstrap',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg' },
    { name: 'Tailwind',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
    { name: 'Material UI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg' },
    { name: 'Three.js',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg', needsInvert: true  },
    { name: 'Docker',     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { name: 'HTML',       icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS',        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
    { name: 'MongoDB',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { name: 'Java',       icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { name: 'Dart',       icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg' },
    { name: 'Flutter',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
    { name: 'Arduino',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg' },
    { name: 'Firebase',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
    { name: 'Godot',      icon: 'https://godotengine.org/assets/press/icon_color.png' },

    /* --- NEWLY ADDED SKILLS --- */
  { name: 'FastAPI',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
  { name: 'Socket.IO',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg', needsInvert: true },
  { name: 'AWS Bedrock', icon: 'https://www.awsicon.com/static/images/Service-Icons/Artificial-Intelligence/64/png5x/Bedrock.png'},
  { name: 'AWS S3',     icon: 'https://user-images.githubusercontent.com/15157491/75435753-6929fc80-594b-11ea-9e19-f78223916862.png' },
  { name: 'Puppeteer',  icon: 'https://www.svgrepo.com/show/354228/puppeteer.svg' },
  { name: 'Cheerio',    icon: 'https://cheerio.js.org/_astro/orange-c.LpIsIfBH_Z1HYzg2.svg' }, 
  { name: 'Drei',       icon: 'https://pmndrs.gallerycdn.vsassets.io/extensions/pmndrs/pmndrs/0.3.7/1676328524141/Microsoft.VisualStudio.Services.Icons.Default'}, 

  ];


  const experience = [
    {
      company: 'CITRIS and the Banatao Institute',
      role: 'Full-Stack Developer Intern',
      period: 'May 2025 – Aug 2025',
      location: 'Remote',
      color: 'from-violet-600 to-indigo-500',
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
      color: 'from-fuchsia-600 to-pink-500',
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
      color: 'from-cyan-600 to-blue-500',
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
      color: 'from-emerald-600 to-teal-500',
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
    description: 'Personal portfolio built with Next.js, React, and Tailwind CSS featuring animated UI and smooth scroll navigation.',
    tags: ['React', 'Next.js', 'Tailwind'],
    color: 'from-violet-600 to-indigo-600',
    image: '/projects/portfolio.png',
    link: 'https://github.com/wtrantan/react-portfolio',
  },
  {
    title: 'KarimeRank',
    description: 'A responsive K-pop idol card ranking application powered by an Elo system. Features interactive visual effects and robust data integration capable of handling approximately 10,000 daily high-volume API requests.',
    tags: [
    'React', 
    'Node.js', 
    'Express.js', 
    'MongoDB', 
    'Firebase', 
    'Tailwind CSS', 
    'JSON Web Token', 
    'Cheerio', 
    'Puppeteer',
    'JavaScript',
    'API Integration',
    'UI/UX'
  ],
    color: 'from-fuchsia-600 to-pink-600',
    image: '/projects/Cover.png',
    link: 'https://karime-rank.vercel.app/',
  },
  {
    title: 'Chat & Chill',
    description: 'A winter-themed multiplayer web game featuring real-time chat, snowball mechanics, and rarity-based fishing within randomly generated shared lobbies, seamlessly supporting up to 8 concurrent players.',
    tags: ['Socket.IO', 'Express.js', 'SQLite', 'WebSockets'],
    color: 'from-cyan-600 to-blue-600',
    image: '/projects/penguin.png',
    link: 'https://cse108-project-shooter-game.onrender.com/',
  },
   {
    title: 'KarinaSys',
    description: 'An introductory exploration of 3D web development with Three.js, demonstrating the fundamentals of manipulating geometries, lighting, and camera perspectives within a digital space.',
    tags: ['Three.js'],
    color: 'from-emerald-400 to-teal-600',
    image: '/projects/karinasys.png',
    link: 'https://karinasys.vercel.app/',
  },
   {
    title: 'Cauldron Creates',
    description: 'A full-stack recipe generation application that utilizes AI to instantly brew healthy, step-by-step meals based on whatever ingredients users currently have on hand. Designed to reduce food waste and streamline meal prep, it features calorie tracking and a personalized digital cookbook for saving favorite dishes.',
    tags: ['React', 'Node.js', 'Express.js','MySQL', 'openAI API'],
    color: 'from-indigo-300 to-purple-400',
    image: '/projects/cauldron.png',
    link: 'https://github.com/wtrantan/HackDavis',
  },
  {
    title: 'Profit Prophet',
    description: 'An AI-powered personal finance assistant that integrates secure banking data to analyze transactions and deliver personalized budgeting advice. Features an intelligent, real-time chatbot designed to empower users with smarter saving strategies and actionable financial clarity.',
    tags: ['React', 'Node.js','Express.js', 'MongoDB', 'Gemini API'],
    color: 'from-orange-400 to-rose-500',
    image: '/projects/profit.jpg',
    link: 'https://github.com/wtrantan/HackDavis',
  },
  
];

  return (
    <div className="bg-[#07050f] text-white font-sans overflow-x-hidden w-full">
      <Head>
        <title>William Trantan — Portfolio</title>
        <meta name="description" content="William Trantan — CS Student & Developer" />
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
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
          willChange: 'left, top',
        }}
      />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-8 py-4"
        style={{ background: 'rgba(7,5,15,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(139,92,246,0.08)' }}>
        <span className="font-['Syne'] font-extrabold text-lg tracking-widest text-violet-300 uppercase">WT</span>
        <ul className="flex gap-5 sm:gap-2">
          {['Home', 'About', 'Skills', 'Experience', 'Projects'].map(item => (
            <li key={item}>
              <Link
                to={item.toLowerCase()}
                spy smooth offset={-72} duration={700}
                onSetActive={() => setActiveSection(item.toLowerCase())}
                className={`cursor-pointer px-3 sm:px-5 py-2 rounded-full font-['DM_Sans'] text-xs sm:text-sm font-medium transition-all duration-300
                  ${activeSection === item.toLowerCase()
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── HERO ── */}
      <section id="home" name="home" className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-16 w-full box-border">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-56 sm:w-80 h-56 sm:h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #4f46e5, transparent)' }} />
 
        <div className="relative z-10 text-center w-full max-w-3xl mx-auto px-4">
          {/* Avatar */}
          <div className="relative inline-block mb-8">
            <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full mx-auto overflow-hidden ring-4 ring-violet-500/40 shadow-2xl shadow-violet-500/20"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
              <img src="/pfp.png" alt="William Trantan" className="w-full h-full object-cover" />
            </div>
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-400 rounded-full border-2 border-[#07050f] shadow-lg shadow-emerald-400/50" />
          </div>
 
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-violet-950/60 border border-violet-500/30 text-violet-300 text-[10px] sm:text-xs font-['DM_Sans'] tracking-widest uppercase px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-5 sm:mb-6">
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse shrink-0" />
            Test Engineer · UC Merced &apos;25
          </div>
 
          <h1 className="font-['Syne'] font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none mb-5 sm:mb-6 pb-2"
            style={{ background: 'linear-gradient(135deg, #fff 0%, #a78bfa 60%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            William<br />Trantan
          </h1>
 
          <p className="font-['DM_Sans'] font-light text-gray-400 text-sm sm:text-base md:text-lg max-w-sm sm:max-w-md mx-auto mb-7 sm:mb-8 leading-relaxed">
            Simply someone building cool digital experiences.
            Passionate about code, hockey, and everything in between.
          </p>
            
          {/* Social links */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-7 sm:mb-8 flex-wrap">
            {[
              { icon: <AiFillGithub />, href: 'https://github.com/wtrantan', label: 'GitHub', grad: 'from-gray-600 to-gray-800' },
              { icon: <AiFillLinkedin />, href: 'https://www.linkedin.com/in/wtrantan/', label: 'LinkedIn', grad: 'from-blue-600 to-blue-800' },
              { icon: <AiFillInstagram />, href: 'https://www.instagram.com/w_trantan/', label: 'Instagram', grad: 'from-pink-600 to-fuchsia-700' },
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
              className="cursor-pointer inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full font-['Syne'] font-bold text-xs sm:text-sm tracking-wide
                bg-violet-600 hover:bg-violet-500 text-white transition-all duration-200 hover:scale-105 shadow-lg shadow-violet-600/30">
              View Projects ↓
            </Link>
            <a href="/resume.pdf" target="_blank"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full font-['Syne'] font-bold text-xs sm:text-sm tracking-wide
                border border-violet-500/40 text-violet-300 hover:bg-violet-950/50 hover:border-violet-400 transition-all duration-200 hover:scale-105">
              Résumé ↗
            </a>
          </div>
        </div>
 
        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="font-['DM_Sans'] text-xs tracking-widest uppercase text-gray-500">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-violet-400 to-transparent animate-pulse" />
        </div>
      </section>

      
      
      {/* ── ABOUT ── */}
      <section id="about" name="about" className="relative min-h-screen flex items-center px-4 sm:px-6 py-24 sm:py-32 w-full">
        <div className="absolute top-20 right-0 w-48 sm:w-72 h-48 sm:h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6d28d9, transparent)' }} />

        <div className="max-w-5xl mx-auto w-full">
          <div className="mb-10 sm:mb-16">
            <span className="font-['DM_Sans'] text-xs tracking-[0.3em] uppercase text-violet-400 mb-3 block">About</span>
            <h2 className="font-['Syne'] font-extrabold text-4xl sm:text-5xl md:text-6xl text-white">Who I am</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 items-center">
            {/* Photo */}
            <div className="relative">
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 mx-auto">
                <div className="absolute inset-0 rounded-3xl rotate-3"
                  style={{ background: 'linear-gradient(135deg, #7c3aed33, #4f46e533)', border: '1px solid rgba(139,92,246,0.2)' }} />
                <div className="absolute inset-0 rounded-3xl overflow-hidden -rotate-1 ring-1 ring-violet-500/20">
                  <img src="/me.jpg" alt="William" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-3 -right-2 sm:-right-3 bg-[#0d0a1e] border border-violet-500/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 shadow-xl">
                  <p className="font-['Syne'] font-bold text-violet-300 text-xs sm:text-sm">Test Engineer</p>
                  <p className="font-['DM_Sans'] text-gray-500 text-xs">Quanta</p>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="mt-10 lg:mt-0">
              <p className="font-['DM_Sans'] font-light text-gray-300 text-base sm:text-lg leading-relaxed mb-5 sm:mb-6">
                Born in <span className="text-violet-300 font-medium">Minnesota</span>, raised in <span className="text-violet-300 font-medium">San Jose</span>.
                I graduated with a Bachelor&apos;s in CSE at UC Merced, driven by a lifelong passion for building
                things with code. From fun side projects to polished software.
              </p>
              <p className="font-['DM_Sans'] font-light text-gray-400 text-sm sm:text-base leading-relaxed mb-7 sm:mb-8">
                Outside of engineering I spend time ice skating, watching hockey,
                going hiking, swimming or playing video games. Keeping myself active while away from the computer, besides video games.
              </p>
              <div className="flex flex-wrap gap-2">
                {/* {skills.map(s => (
                  <span key={s.name}
                    className="font-['DM_Sans'] text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-violet-800/60 text-violet-300 bg-violet-950/30 hover:bg-violet-900/40 hover:border-violet-600/60 transition-all duration-200 cursor-default">
                    {s.name}
                  </span>
                ))} */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS SECTION ── */}
      <section id="skills" name="skills" className="relative py-24 px-4 sm:px-6 border-y border-violet-900/30 overflow-hidden w-full"
        style={{ background: 'rgba(109,40,217,0.02)' }}>
        
        {/* Background Decor */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(rgba(139,92,246,0.1) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="font-['DM_Sans'] text-xs tracking-[0.3em] uppercase text-violet-400 mb-3 block">Technologies I&apos;ve used so far</span>
            <h2 className="font-['Syne'] font-extrabold text-4xl sm:text-5xl text-white">Tech Stack</h2>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 sm:gap-6">
            {skills.map(({ name, icon, needsInvert }) => (
                <div key={name} className="group ...">
                  <img 
                    src={icon} 
                    alt={name} 
                    className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain transition-all duration-300 
                      ${needsInvert ? 'brightness-0 invert' : ''} 
                      group-hover:scale-110`} 
                  />
                  <span className="...">
                    {name}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </section>




       {/* ── EXPERIENCE ── */}
      <section id="experience" name="experience" className="relative px-4 sm:px-6 py-24 sm:py-32 w-full">
        <div className="absolute top-20 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
 
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 sm:mb-16">
            <span className="font-['DM_Sans'] text-xs tracking-[0.3em] uppercase text-violet-400 mb-3 block">Experience</span>
            <h2 className="font-['Syne'] font-extrabold text-4xl sm:text-5xl md:text-6xl text-white">Where I&apos;ve worked</h2>
          </div>
 
          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-violet-600 via-violet-800 to-transparent ml-[7px] hidden sm:block" />
 
            <div className="flex flex-col gap-10 sm:gap-12">
              {experience.map((job, i) => (
                <div key={i} className="group relative flex gap-6 sm:gap-8">
                  {/* Timeline dot */}
                  <div className="hidden sm:flex flex-col items-center shrink-0 mt-1">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${job.color} ring-4 ring-[#07050f] group-hover:scale-125 transition-transform duration-300`} />
                  </div>
 
                  {/* Card */}
                  <div className="flex-1 rounded-2xl border border-white/5 hover:border-violet-500/20 bg-white/[0.02] hover:bg-white/[0.03] p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-violet-900/10">
                    {/* Top accent bar */}
                    <div className={`h-0.5 w-10 rounded-full bg-gradient-to-r ${job.color} mb-4 group-hover:w-full transition-all duration-500`} />
 
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 mb-1">
                      <h3 className="font-['Syne'] font-extrabold text-lg sm:text-xl text-white leading-tight">{job.company}</h3>
                      <span className="font-['DM_Sans'] text-xs text-violet-400 bg-violet-950/50 border border-violet-800/40 px-3 py-1 rounded-full shrink-0 self-start">{job.period}</span>
                    </div>
 
                    <p className={`font-['DM_Sans'] font-medium text-sm bg-gradient-to-r ${job.color} bg-clip-text text-transparent mb-1`}>{job.role}</p>
                    <p className="font-['DM_Sans'] text-xs text-gray-600 mb-4">{job.location}</p>
 
                    <ul className="flex flex-col gap-2">
                      {job.bullets.map((b, j) => (
                        <li key={j} className="flex gap-2 items-start">
                          <span className="text-violet-500 mt-1 shrink-0 text-xs">▹</span>
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
      </section>
      {/* ── PROJECTS ── */}
      <section id="projects" name="projects" className="relative min-h-screen px-4 sm:px-6 py-24 sm:py-32 w-full">
        <div className="absolute bottom-20 left-0 w-64 sm:w-80 h-64 sm:h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />

        <div className="max-w-5xl mx-auto">
          <div className="mb-10 sm:mb-16">
            <span className="font-['DM_Sans'] text-xs tracking-[0.3em] uppercase text-violet-400 mb-3 block">Work</span>
            <h2 className="font-['Syne'] font-extrabold text-4xl sm:text-5xl md:text-6xl text-white">Projects</h2>
            <p ></p>
          </div>

         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
            {projects.map((p, i) => (
              <a key={i} href={p.link} target="_blank" rel="noreferrer"
                className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-violet-500/30 bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-900/20 cursor-pointer flex flex-col">

                {/* Project image */}
                <div className="relative w-full h-44 sm:h-48 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-20 z-10`} />
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Gradient fade into card body */}
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0d0a1a] to-transparent z-20" />
                </div>

                {/* Card body */}
                <div className=" flex-col flex-1 p-5 sm:p-6">
                  <div className={`h-0.5 w-10 rounded-full bg-gradient-to-r ${p.color} mb-4 group-hover:w-full transition-all duration-500`} />
                  <h3 className="font-['Syne'] font-bold text-lg sm:text-xl text-white mb-2">{p.title}</h3>
                  <p className="font-['DM_Sans'] font-light text-gray-400 text-sm leading-relaxed mb-5 flex-1">{p.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map(t => (
                      <span key={t} className={`text-xs font-['DM_Sans'] px-3 py-1 rounded-full bg-gradient-to-r ${p.color} bg-opacity-10 text-white/70 border border-white/10`}>{t}</span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* GitHub CTA */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-4 sm:gap-5 p-8 sm:p-10 rounded-3xl border border-violet-800/30 bg-violet-950/20 w-full sm:w-auto">
              <AiFillGithub className="text-5xl sm:text-6xl text-violet-400" />
              <div className="text-center">
                <p className="font-['Syne'] font-bold text-lg sm:text-xl text-white mb-1">See everything on GitHub</p>
                <p className="font-['DM_Sans'] text-gray-500 text-sm">More projects, contributions, and experiments</p>
              </div>
              <a href="https://github.com/wtrantan" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full font-['Syne'] font-bold text-sm bg-violet-600 hover:bg-violet-500 text-white transition-all duration-200 hover:scale-105 shadow-lg shadow-violet-600/30">
                View GitHub ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
     <footer className="border-t border-violet-900/20 pt-8 pb-[20vh] sm:pt-10 text-center px-4">
      <p className="font-['DM_Sans'] text-gray-600 text-xs sm:text-sm">
    © 2026 William Trantan · Built with Next.js & Tailwind CSS
   </p>
</footer>
    </div>
  );
}