import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ArrowDownRight, ArrowUpRight, Github, Linkedin, Mail, FileText } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [cursorVariant, setCursorVariant] = useState('default');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Initialize smooth scrolling and cursor
  useEffect(() => {
    const mobile = window.innerWidth < 768;

    // Optimized Lenis Smooth Scroll Setup for Mobile & Tablet Segmented Scrolling
    const lenis = new Lenis({
      duration: mobile ? 1.0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: mobile ? 1.5 : 2,
      syncTouch: true, // Crucial for syncing touch swiping with GSAP ScrollTrigger snaps
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Vanilla JS cursor tracking for performance
    const cursorEl = document.getElementById('custom-cursor');
    const updateCursor = (e: MouseEvent) => {
      if (cursorEl) {
        gsap.to(cursorEl, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: 'power3.out'
        });
      }
    };
    window.addEventListener('mousemove', updateCursor);

    // Initial Hero Animation Setup
    gsap.set('#dynamic-name', {
      top: '50%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      fontSize: mobile ? '18vw' : '15vw',
      transformOrigin: 'center center'
    });

    // Fade logo and subtitle in
    const tl = gsap.timeline();
    tl.fromTo('#dynamic-name', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.5, ease: 'power4.out' })
      .fromTo('.hero-subtext', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, "-=0.8");

    // Scroll Animation for shrinking and moving the Name
    gsap.to('#dynamic-name', {
      top: mobile ? '24px' : '40px', // Matches the nav padding (p-6/24px or p-10/40px)
      left: mobile ? '24px' : '40px',
      xPercent: 0,
      yPercent: 0,
      fontSize: mobile ? '1.25rem' : '1.5rem', // Matches text-xl / text-2xl
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true // Smoother tie to scroll position for snapping
      }
    });

    // Fade out hero subtext on scroll
    gsap.fromTo('.hero-subtext', 
      { opacity: 1, y: 0 },
      {
        opacity: 0,
        y: -50,
        immediateRender: false,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'center top',
          scrub: true
        }
      }
    );

    // GLOBAL SNAPPING ENGINE - Creating distinct segmented sections
    let mm = gsap.matchMedia();

    // Optimize for mobile/tablet by making snapping slower and completely tied to logical sections
    mm.add("(min-width: 768px)", () => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        snap: {
          snapTo: ".snap-element", // Logical blocks defined in the UI
          duration: { min: 0.4, max: 1.0 }, // Slower cinematic duration
          delay: 0.1, // Faster initiation
          ease: "power3.inOut" // Smoother easing
        }
      });
    });

    mm.add("(max-width: 767px)", () => {
       ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        snap: {
          snapTo: ".snap-element", 
          duration: { min: 0.2, max: 0.5 }, // Faster snapping on mobile
          delay: 0.15,
          ease: "power1.inOut"
        }
      });
    });

    // Dynamic Background Color Changes based on scroll (Sectionwise Colors)
    ScrollTrigger.create({
      trigger: '#about-section',
      start: 'top 50%',
      end: 'bottom 40%',
      onEnter: () => gsap.to('body', { backgroundColor: '#1C1B1A', color: '#F4F1EA', duration: 0.6 }),
      onEnterBack: () => gsap.to('body', { backgroundColor: '#1C1B1A', color: '#F4F1EA', duration: 0.6 }),
      onLeaveBack: () => gsap.to('body', { backgroundColor: '#F4F1EA', color: '#1C1B1A', duration: 0.6 }),
    });

    ScrollTrigger.create({
      trigger: '#projects-section',
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => gsap.to('body', { backgroundColor: '#F4F1EA', color: '#1C1B1A', duration: 0.6 }),
      onEnterBack: () => gsap.to('body', { backgroundColor: '#F4F1EA', color: '#1C1B1A', duration: 0.6 }),
    });

    ScrollTrigger.create({
      trigger: '#contact-section',
      start: 'top 70%',
      onEnter: () => gsap.to('body', { backgroundColor: '#DE5D26', color: '#1C1B1A', duration: 0.6 }),
      onEnterBack: () => gsap.to('body', { backgroundColor: '#DE5D26', color: '#1C1B1A', duration: 0.6 }),
    });

    return () => {
      lenis.destroy();
      window.removeEventListener('mousemove', updateCursor);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Handle cursor hover states
  const handleHoverEnter = () => setCursorVariant('hovering');
  const handleHoverLeave = () => setCursorVariant('default');

  return (
    <div ref={containerRef} className="relative w-full min-h-screen">
      {/* Custom Cursor */}
      <div 
        id="custom-cursor" 
        className={`custom-cursor hidden md:block ${cursorVariant === 'hovering' ? 'hovering' : ''}`}
      />

      {/* FIXED DYNAMIC NAME LOGO */}
      <div 
        id="dynamic-name" 
        className="fixed font-display font-bold uppercase tracking-tight z-50 mix-blend-difference text-[var(--color-marty-bg)] whitespace-nowrap pointer-events-none"
      >
        SHARISH SK
      </div>

      <nav className="fixed top-0 w-full p-6 md:p-10 flex justify-end items-center z-40 mix-blend-difference text-[var(--color-marty-bg)] pointer-events-none">
        <div className="flex gap-6 text-sm font-medium uppercase tracking-widest hidden md:flex pointer-events-auto">
          <a href="#about-section" onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverLeave} className="hover:opacity-60 transition-opacity">About</a>
          <a href="#projects-section" onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverLeave} className="hover:opacity-60 transition-opacity">Projects</a>
          <a href="#contact-section" onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverLeave} className="hover:opacity-60 transition-opacity">Contact</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section ref={heroRef} className="snap-element h-screen w-full flex flex-col justify-end p-6 md:p-12 pb-24 relative isolate overflow-hidden">
        <div className="w-full max-w-7xl mx-auto flex flex-col justify-end h-full">
          <div className="hero-subtext opacity-0 translate-y-8 flex flex-col md:flex-row md:items-end justify-between border-t border-current pt-8 w-full font-medium">
            <p className="text-lg md:text-2xl font-medium leading-relaxed max-w-3xl mb-8 md:mb-0">
              Computer Science student specializing in building secure data pipelines, containerizing ML deployments, and architecting full-stack solutions.
            </p>
            <span className="flex items-center gap-2 font-mono text-xs md:text-sm uppercase tracking-widest opacity-60 flex-shrink-0">
              <ArrowDownRight size={16} /> Scroll
            </span>
          </div>
        </div>
      </section>

      {/* ABOUT & EXPERTISE - Split into smaller snap blocks for mobile readability */}
      <section id="about-section" className="w-full flex flex-col">
        {/* Intro Block */}
        <div className="snap-element min-h-[70vh] py-32 px-6 md:px-12 flex flex-col justify-center max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 w-full">
            <div className="md:col-span-4">
              <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6 leading-none">Expertise<br/>& Context</h2>
              <p className="text-sm uppercase tracking-widest opacity-60 mb-12 flex flex-col gap-2">
                <span>SRM Institute of Science and Tech</span>
                <span>B.Tech '27 • 8.68 CGPA</span>
              </p>
            </div>
            <div className="md:col-span-8 flex flex-col gap-8 md:gap-12 text-xl md:text-2xl font-medium leading-relaxed">
              <p>
                Passionate about building secure data pipelines, containerizing machine learning deployments, and architecting full-stack solutions for complex, hardware-integrated environments.
              </p>
              <p className="opacity-70 text-lg">
                When I'm not writing bash scripts or debugging Docker containers, I'm a huge fan of high-precision action and Souls-like games. Having mastered the FromSoftware library, I'm eagerly anticipating titles like Black Myth: Wukong and Silksong.
              </p>
            </div>
          </div>
        </div>

        {/* Experience Block */}
        <div className="snap-element min-h-[50vh] py-24 px-6 md:px-12 flex flex-col justify-center max-w-7xl mx-auto w-full">
          <div 
            className="p-8 md:p-12 border border-current rounded-[2rem] hover:bg-[#F4F1EA] hover:text-[#1C1B1A] transition-colors duration-500 cursor-default group"
            onMouseEnter={handleHoverEnter} 
            onMouseLeave={handleHoverLeave}
          >
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 border-b border-current pb-6 gap-4">
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-bold uppercase transition-transform group-hover:translate-x-2">Software Dev Intern</h3>
                <p className="text-sm font-mono uppercase mt-2 opacity-80">ZF Rane Automotive India • Dec 2024</p>
              </div>
            </div>
            <p className="text-lg">
              Developed an AI chatbot using NLP to convert natural language into MSSQL commands. Deployed inference systems using Docker and FastAPI. Automated enterprise data workflows to eliminate manual querying.
            </p>
          </div>
        </div>

        {/* Skills Block */}
        <div className="snap-element min-h-[50vh] py-24 px-6 md:px-12 flex flex-col justify-center max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest mb-4 opacity-50">01 / Systems</h4>
              <p className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight">Linux, Bash, Docker, Kubernetes</p>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest mb-4 opacity-50">02 / Languages</h4>
              <p className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight">Python, C, C++, JavaScript</p>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest mb-4 opacity-50">03 / Web & Data</h4>
              <p className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight">FastAPI, Flask, MSSQL, MongoDB</p>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest mb-4 opacity-50">04 / AI & ML</h4>
              <p className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight">TensorFlow, NLP, XGBoost</p>
            </div>
          </div>
        </div>
      </section>

      {/* SELECTED PROJECTS */}
      <section id="projects-section" className="w-full flex flex-col">
        {/* Title Block */}
        <div className="snap-element min-h-[40vh] pt-48 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full flex justify-between items-end">
          <h2 className="font-display text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-none">Selected<br/>Works</h2>
          <span className="font-mono text-xs md:text-sm uppercase border-b border-current pb-2 opacity-80">2023 — Present</span>
        </div>

        <div className="flex flex-col border-t-2 border-current px-6 md:px-12 max-w-7xl mx-auto w-full">
          
          {/* Project 1 */}
          <div className="snap-element py-24 md:py-32 border-b border-current flex flex-col md:flex-row gap-8 justify-between hover:pl-4 transition-all duration-300" onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverLeave}>
            <div className="md:w-5/12">
              <span className="font-mono text-xs md:text-sm uppercase tracking-widest block opacity-60 mb-4">Edge & AI</span>
              <h3 className="font-display text-4xl md:text-6xl font-bold uppercase leading-tight tracking-tight">Cloud-Edge IDS</h3>
            </div>
            <div className="md:w-6/12 flex flex-col justify-center mt-4 md:mt-0">
              <p className="text-lg md:text-xl font-medium opacity-80 leading-relaxed mb-8">
                Architected an edge auditor deployed on Raspberry Pi hardware to effectively manage AI workloads. Implemented Random Forest algorithms for real-time, localized intrusion detection.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Raspberry Pi', 'Random Forest', 'Cloud Architecture'].map(t => (
                  <span key={t} className="px-4 py-2 border border-current rounded-full text-[10px] md:text-xs font-mono uppercase tracking-widest">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Project 2 */}
          <div className="snap-element py-24 md:py-32 border-b border-current flex flex-col md:flex-row gap-8 justify-between hover:pl-4 transition-all duration-300" onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverLeave}>
            <div className="md:w-5/12">
              <span className="font-mono text-xs md:text-sm uppercase tracking-widest block opacity-60 mb-4">Cybersecurity</span>
              <h3 className="font-display text-4xl md:text-6xl font-bold uppercase leading-tight tracking-tight">Project Unveil</h3>
            </div>
            <div className="md:w-6/12 flex flex-col justify-center mt-4 md:mt-0">
              <p className="text-lg md:text-xl font-medium opacity-80 leading-relaxed mb-8">
                Comprehensive forensic framework analyzing complex network protocols to audit TOR network traffic for de-anonymization using advanced Python and Bash scripting.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Python', 'Bash Scripting', 'Network Protocols', 'TOR'].map(t => (
                  <span key={t} className="px-4 py-2 border border-current rounded-full text-[10px] md:text-xs font-mono uppercase tracking-widest">{t}</span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Project 3 */}
          <div className="snap-element py-24 md:py-32 border-b border-current flex flex-col md:flex-row gap-8 justify-between hover:pl-4 transition-all duration-300" onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverLeave}>
            <div className="md:w-5/12">
              <span className="font-mono text-xs md:text-sm uppercase tracking-widest block opacity-60 mb-4">Full-stack Cloud</span>
              <h3 className="font-display text-4xl md:text-6xl font-bold uppercase leading-tight tracking-tight">AWS Inventory</h3>
            </div>
            <div className="md:w-6/12 flex flex-col justify-center mt-4 md:mt-0">
              <p className="text-lg md:text-xl font-medium opacity-80 leading-relaxed mb-8">
                Engineered and deployed a full-stack web application on AWS with Flask and a cloud-hosted MSSQL database, resulting in an 85% reduction in data entry errors.
              </p>
              <div className="flex flex-wrap gap-3">
                {['AWS', 'Flask', 'MSSQL', 'Web App'].map(t => (
                  <span key={t} className="px-4 py-2 border border-current rounded-full text-[10px] md:text-xs font-mono uppercase tracking-widest">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Project 4 */}
          <div className="snap-element py-24 md:py-32 flex flex-col md:flex-row gap-8 justify-between hover:pl-4 transition-all duration-300" onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverLeave}>
            <div className="md:w-5/12">
              <span className="font-mono text-xs md:text-sm uppercase tracking-widest block opacity-60 mb-4">Mobile & IoT</span>
              <h3 className="font-display text-4xl md:text-6xl font-bold uppercase leading-tight tracking-tight">Wear OS Health</h3>
            </div>
            <div className="md:w-6/12 flex flex-col justify-center mt-4 md:mt-0">
              <p className="text-lg md:text-xl font-medium opacity-80 leading-relaxed mb-8">
                Engineered a low-latency data streaming protocol to transmit real-time vital signs via Bluetooth using Kotlin, implementing CRC and Hamming Code algorithms for 99.9% reliable transmission.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Kotlin', 'Wear OS', 'Bluetooth', 'Algorithms'].map(t => (
                  <span key={t} className="px-4 py-2 border border-current rounded-full text-[10px] md:text-xs font-mono uppercase tracking-widest">{t}</span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER / CONTACT */}
      <section id="contact-section" className="snap-element min-h-screen w-full flex flex-col justify-between py-24 px-6 md:px-12 relative overflow-hidden">
        {/* Massive background text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-5">
          <h2 className="font-display text-[20vw] font-bold uppercase leading-none tracking-tighter">BUILD</h2>
        </div>

        <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col justify-center items-center z-10 text-center">
          <h2 className="font-display text-6xl md:text-[8vw] font-bold uppercase tracking-tighter leading-none mb-8">
            Let's build<br/>something.
          </h2>
          <p className="text-xl md:text-2xl font-medium mb-12 max-w-2xl px-4">
            Currently open for new opportunities, collaborations, and discussions about edge compute architecture.
          </p>
          
          <a 
            href="mailto:sharishsasi@gmail.com"
            onMouseEnter={handleHoverEnter} 
            onMouseLeave={handleHoverLeave}
            className="group relative inline-flex items-center gap-4 text-2xl md:text-4xl font-display font-bold uppercase border-b-2 border-current pb-2 hover:opacity-70 transition-opacity pointer-events-auto"
          >
            Say Hello <ArrowUpRight className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
          </a>
        </div>

        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center z-10 border-t border-current pt-8 mt-12 gap-8 md:gap-0">
          <div className="font-mono text-sm uppercase tracking-widest">
            © {new Date().getFullYear()} Sharish SK
          </div>
          
          <div className="flex gap-6 md:gap-8 flex-wrap justify-center pointer-events-auto">
            <a href="https://github.com/sharishsk20" target="_blank" rel="noreferrer" onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverLeave} className="flex items-center gap-2 font-mono text-xs md:text-sm uppercase tracking-widest hover:opacity-60 transition-opacity">
              <Github size={18} /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/sharishsk20" target="_blank" rel="noreferrer" onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverLeave} className="flex items-center gap-2 font-mono text-xs md:text-sm uppercase tracking-widest hover:opacity-60 transition-opacity">
              <Linkedin size={18} /> LinkedIn
            </a>
            <a href="mailto:sharishsasi@gmail.com" onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverLeave} className="flex items-center gap-2 font-mono text-xs md:text-sm uppercase tracking-widest hover:opacity-60 transition-opacity">
              <Mail size={18} /> Email
            </a>
            <a href="#" onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverLeave} className="flex items-center gap-2 font-mono text-xs md:text-sm uppercase tracking-widest hover:opacity-60 transition-opacity text-white bg-black/20 dark:bg-white/20 px-4 py-2 rounded-full border border-current">
              <FileText size={18} /> Resume
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
