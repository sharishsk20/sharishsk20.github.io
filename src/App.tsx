import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ArrowDownRight, ArrowUpRight, Github, Linkedin, Mail, FileText, X, Music } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [cursorVariant, setCursorVariant] = useState('default');
  const [modalContent, setModalContent] = useState<{title: string, subtitle?: string, content: React.ReactNode} | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize smooth scrolling and cursor
  useEffect(() => {
    const mobile = window.innerWidth < 768;

    const lenis = new Lenis({
      duration: mobile ? 1.0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: mobile ? 1.5 : 2,
      syncTouch: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

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

    gsap.set('#dynamic-name', {
      top: '50%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      fontSize: mobile ? '18vw' : '15vw',
      transformOrigin: 'center center'
    });

    const tl = gsap.timeline();
    tl.fromTo('#dynamic-name', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.5, ease: 'power4.out' })
      .fromTo('.hero-subtext', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, "-=0.8");

    gsap.to('#dynamic-name', {
      top: mobile ? '24px' : '40px',
      left: mobile ? '24px' : '40px',
      xPercent: 0,
      yPercent: 0,
      fontSize: mobile ? '1.25rem' : '1.5rem',
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true 
      }
    });

    // Fade out hero subtext on scroll nicely and allow it to return
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

    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        snap: {
          snapTo: ".snap-element",
          duration: { min: 0.4, max: 1.0 },
          delay: 0.1,
          ease: "power3.inOut"
        } as any
      });
    });

    mm.add("(max-width: 767px)", () => {
       ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        snap: {
          snapTo: ".snap-element", 
          duration: { min: 0.2, max: 0.5 },
          delay: 0.15,
          ease: "power1.inOut"
        } as any
      });
    });

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

    // REVEAL ANIMATIONS
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    return () => {
      lenis.destroy();
      window.removeEventListener('mousemove', updateCursor);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const handleHoverEnter = () => setCursorVariant('hovering');
  const handleHoverLeave = () => setCursorVariant('default');

  const handleOpenModal = (title: string, subtitle: string, content: React.ReactNode) => {
    setModalContent({ title, subtitle, content });
    lenisRef.current?.stop();
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setModalContent(null);
    lenisRef.current?.start();
    document.body.style.overflow = 'auto';
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("sharishsasi@gmail.com");
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2500);
  };

  return (
    <div ref={containerRef} className="relative w-full min-h-screen pb-[env(safe-area-inset-bottom)]">
      
      {/* MODAL OVERLAY */}
      {modalContent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md" onClick={handleCloseModal}>
          <div 
            className="bg-[#F4F1EA] text-[#1C1B1A] rounded-[2rem] max-w-4xl w-full max-h-[85vh] flex flex-col relative shadow-2xl overscroll-none" 
            onClick={e => e.stopPropagation()}
            data-lenis-prevent
          >
            {/* Sticky header with close button */}
            <div className="sticky top-0 z-10 bg-[#F4F1EA] rounded-t-[2rem] px-8 md:px-12 pt-8 pb-4 flex justify-between items-start border-b border-black/10">
              <div>
                <h3 className="font-display text-3xl md:text-5xl font-bold uppercase">{modalContent.title}</h3>
                {modalContent.subtitle && <p className="font-mono text-sm md:text-base opacity-70 mt-3 border-l-2 border-[#DE5D26] pl-4">{modalContent.subtitle}</p>}
              </div>
              <button 
                className="ml-4 flex-shrink-0 p-2 bg-black/10 rounded-full hover:bg-black/20 transition-colors"
                onClick={handleCloseModal}
              >
                <X size={24} />
              </button>
            </div>
            {/* Scrollable content */}
            <div className="overflow-y-auto px-8 md:px-12 py-8 font-medium text-base md:text-lg">
              {modalContent.content}
            </div>
          </div>

        </div>
      )}

      {/* Custom Cursor */}
      <div 
        id="custom-cursor" 
        className={`custom-cursor hidden md:block ${cursorVariant === 'hovering' ? 'hovering' : ''}`}
      />

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

      {/* ABOUT & EXPERTISE */}
      <section id="about-section" className="w-full flex flex-col">
        <div className="snap-element min-h-[70vh] py-32 px-6 md:px-12 flex flex-col justify-center max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 w-full">
            <div className="md:col-span-4 reveal">
              <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6 leading-none">Expertise<br/>& Context</h2>
              <p className="text-sm uppercase tracking-widest opacity-60 mb-12 flex flex-col gap-2">
                <span>SRM Institute of Science and Technology</span>
                <span>B.Tech-CSE '27 • 8.68 CGPA</span>
              </p>
            </div>
            <div className="md:col-span-8 flex flex-col gap-8 md:gap-12 text-xl md:text-2xl font-medium leading-relaxed reveal">
              <p>
                Passionate about building secure data pipelines, containerizing machine learning deployments, and architecting full-stack solutions for complex, hardware-integrated environments.
              </p>
              <p className="opacity-70 text-lg">
                My approach to technology is rooted in a lifelong fascination with how complex systems operate and a personal history of competing in high-stakes environments. Having spent years in national-level competitive sports, I developed a disciplined focus and a reliance on instinct that now defines my technical work. I am most effective when navigating challenges that require both meticulous preparation and the ability to adapt—finding the "clutch" solution when the pressure is highest and the margin for error is thin.
              </p>
              <p className="opacity-70 text-lg">
                Beyond the terminal, I'm drawn to anything that prioritizes atmosphere and intricate craft. Whether it's the layered, psychedelic production of modern hip-hop, the visual storytelling of film, or the mechanical discipline of a demanding game, I value experiences that reward patience and a deep understanding of the medium. I don't just participate in these spaces; I study the flow and the mechanics that make them work.
              </p>
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <div className="snap-element min-h-[50vh] py-24 px-6 md:px-12 flex flex-col justify-center max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-end mb-12 border-b border-current pb-4 reveal">
            <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tight leading-none">Work<br/>Experience</h2>
            <span className="font-mono text-xs md:text-sm uppercase opacity-80">Professional</span>
          </div>

          <div 
            className="p-8 md:p-12 border border-current rounded-[2rem] hover:bg-[#F4F1EA] hover:text-[#1C1B1A] transition-colors duration-500 cursor-pointer group reveal"
            onMouseEnter={handleHoverEnter} 
            onMouseLeave={handleHoverLeave}
            onClick={() => handleOpenModal(
              "Software Development Intern",
              "December 2024 • ZF RANE Automotive India Pvt Ltd Chennai, Tamil Nadu",
              <ul className="list-disc pl-6 space-y-4 pt-4 opacity-90 leading-relaxed marker:text-[#DE5D26]">
                <li>Developed an AI-powered SQL chatbot leveraging Multimodal Learning and NLP to interpret natural language queries and automatically generate SQL commands for MSSQL database retrieval.</li>
                <li>Automated complex data extraction workflows, enabling non-technical users to access enterprise data without manual SQL query writing, improving accessibility across departments.</li>
                <li>Reduced report generation time from hours to minutes by streamlining data retrieval processes, significantly increasing operational efficiency.</li>
                <li>Designed and implemented scalable AI-driven automation systems for enterprise deployment, gaining hands-on experience in production-level machine learning solutions.</li>
              </ul>
            )}
          >
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 border-b border-current pb-6 gap-4">
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-bold uppercase transition-transform group-hover:translate-x-2 flex items-center gap-4">Software Dev Intern <ArrowUpRight className="hidden md:inline-block opacity-0 -translate-y-2 -translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" size={24} /></h3>
                <p className="text-sm font-mono uppercase mt-2 opacity-80">ZF Rane Automotive India • Dec 2024</p>
              </div>
            </div>
            <p className="text-lg">
              Click to view detailed responsibilities involving AI chatbots, automated enterprise data workflows, and Multimodal NLP solutions.
            </p>
          </div>
        </div>

        {/* Skills Block */}
        <div className="snap-element min-h-[50vh] py-24 px-6 md:px-12 flex flex-col justify-center max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-end mb-12 border-b border-current pb-4 reveal">
            <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tight leading-none">Technical<br/>Skills</h2>
            <span className="font-mono text-xs md:text-sm uppercase opacity-80">Core Competencies</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
            <div className="reveal">
              <h4 className="text-xs font-mono uppercase tracking-widest mb-4 opacity-50">01 / Systems & Infrastructure</h4>
              <p className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight">Linux, Shell Scripting (Bash), Docker, Kubernetes (Basics), Networking (TCP/IP)</p>
            </div>
            <div className="reveal">
              <h4 className="text-xs font-mono uppercase tracking-widest mb-4 opacity-50">02 / Programming Languages</h4>
              <p className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight">Python, C, C++, JavaScript, Kotlin</p>
            </div>
            <div className="reveal">
              <h4 className="text-xs font-mono uppercase tracking-widest mb-4 opacity-50">03 / Web Technologies & DBs</h4>
              <p className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight">FastAPI, Flask, HTML, CSS, MSSQL, MongoDB</p>
            </div>
            <div className="reveal">
              <h4 className="text-xs font-mono uppercase tracking-widest mb-4 opacity-50">04 / AI & ML Frameworks</h4>
              <p className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight">TensorFlow, NLP, CatBoost, XGBoost, scikit-learn</p>
            </div>
            <div className="reveal">
              <h4 className="text-xs font-mono uppercase tracking-widest mb-4 opacity-50">05 / Tools & Technologies</h4>
              <p className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight">Git/GitHub, Android Studio, Wear OS</p>
            </div>
          </div>
        </div>
      </section>

      {/* SELECTED PROJECTS */}
      <section id="projects-section" className="w-full flex flex-col">
        <div className="snap-element min-h-[40vh] pt-48 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full flex justify-between items-end reveal">
          <h2 className="font-display text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-none">Selected<br/>Works</h2>
          <span className="font-mono text-xs md:text-sm uppercase border-b border-current pb-2 opacity-80">2023 — Present</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-t-2 border-l-2 border-current max-w-7xl mx-auto w-full">

          {/* Project 1: Cloud-Edge IDS */}
          <div
            className="border-b-2 border-r-2 border-current px-6 md:px-10 py-10 md:py-14 flex flex-col gap-6 hover:bg-black/[0.04] transition-colors duration-300 cursor-pointer group reveal"
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
            onClick={() => handleOpenModal(
              "Cloud-Edge IDS",
              "Edge & AI Architecture",
              <div className="space-y-8 opacity-90 leading-relaxed pt-2">
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">1. Edge Auditor & Resource Management</h4>
                  <p>Deployed the auditor as a containerized microservice on K3s (lightweight Kubernetes) running on a Raspberry Pi — where every MB of RAM counts.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Workload Orchestration:</strong> Monitored CPU and RAM usage in real-time to ensure the Random Forest inference process never starved other critical system services running on the same node.</li>
                    <li><strong>Data Pre-processing at the Edge:</strong> Instead of streaming full packet captures (PCAPs) to the cloud, I extracted key network flow features — duration, protocol type, byte counts — directly on-device, cutting data footprint by over 90%.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">2. Localized Random Forest Inference</h4>
                  <p>Chose Random Forest for its strong accuracy-to-efficiency ratio on constrained ARM hardware.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Model Optimization:</strong> Converted the trained model to a lightweight format to reduce memory overhead on the Pi's ARM architecture.</li>
                    <li><strong>Real-time Detection:</strong> Captured live network traffic using Scapy and fed extracted features into the classifier, which labelled flows as Benign or Malicious (DoS, Port Scan, Brute Force) in milliseconds.</li>
                    <li><strong>Localized Response:</strong> On detecting a threat, triggered an immediate iptables rule update to block the malicious IP — no cloud round-trip required.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">3. Secure Cloud Synchronization</h4>
                  <p>Designed the cloud layer to act as the long-term memory and global dashboard for the system.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Async Logging:</strong> Synced only alerts and telemetry summaries to the cloud over MQTT with TLS — keeping bandwidth usage minimal and the pipeline secure.</li>
                    <li><strong>Federated Retraining:</strong> Aggregated anonymized edge telemetry periodically to retrain the model in the cloud and push updated weights back to the Pi, enabling the system to adapt to new attack patterns over time.</li>
                  </ul>
                </div>
              </div>
            )}
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-widest block opacity-60 mb-3">Edge & AI</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold uppercase leading-tight tracking-tight flex items-start gap-3">Cloud-Edge IDS <ArrowUpRight className="flex-shrink-0 opacity-0 -translate-y-1 -translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" /></h3>
            </div>
            <p className="text-base md:text-lg font-medium opacity-80 leading-relaxed flex-grow">
              Architected and deployed an edge auditor on Raspberry Pi hardware to manage AI workloads under resource constraints. Implemented a Random Forest classifier for real-time, localized network intrusion detection with secure cloud synchronization.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Raspberry Pi', 'Random Forest', 'Cloud Architecture'].map(t => (
                <span key={t} className="px-3 py-1.5 border border-current rounded-full text-[10px] font-mono uppercase tracking-widest">{t}</span>
              ))}
            </div>
          </div>

          {/* Project 2: OnionScope */}
          <div
            className="border-b-2 border-r-2 border-current px-6 md:px-10 py-10 md:py-14 flex flex-col gap-6 hover:bg-black/[0.04] transition-colors duration-300 cursor-pointer group reveal"
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
            onClick={() => handleOpenModal(
              "OnionScope",
              "TOR Forensics & Traffic Correlation",
              <div className="space-y-8 opacity-90 leading-relaxed pt-2">
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">1. DeepCorr-Inspired Correlation Engine</h4>
                  <p>Multi-metric engine linking TOR entry and exit flows without breaking encryption.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Statistical Correlation:</strong> Combined cross-correlation, KL divergence, and cosine similarity over packet timing and size distributions to score the likelihood that two flows belong to the same circuit.</li>
                    <li><strong>Scapy PCAP Analysis:</strong> Parsed raw captures to extract inter-packet timing, burst patterns, and directional byte counts as the feature basis for correlation.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">2. Live Relay Intelligence via Onionoo</h4>
                  <p>Enriched captured circuits with real relay consensus data.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Relay Mapping:</strong> Resolved observed hops to relay fingerprints, geolocation, and bandwidth weights to reconstruct probable circuit paths.</li>
                    <li><strong>Forensic Records:</strong> Persisted findings to SQLite with timestamps and confidence scores for reproducible, auditable reports.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">3. Full-Stack Analysis Platform</h4>
                  <p>Deployable tool, not a pile of scripts.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>FastAPI Backend:</strong> Exposed correlation runs and relay lookups as REST endpoints over an async pipeline.</li>
                    <li><strong>React + D3.js Frontend:</strong> Visualized circuit paths and correlation scores interactively so analysts can inspect candidate matches at a glance.</li>
                  </ul>
                </div>
                <a href="https://github.com/sharishsk20/onionscope" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-sm border-b border-[#DE5D26] text-[#DE5D26] hover:opacity-70 transition-opacity mt-2">
                  GitHub: sharishsk20/onionscope <ArrowUpRight size={14} />
                </a>
              </div>
            )}
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-widest block opacity-60 mb-3">Cybersecurity</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold uppercase leading-tight tracking-tight flex items-start gap-3">OnionScope <ArrowUpRight className="flex-shrink-0 opacity-0 -translate-y-1 -translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" /></h3>
            </div>
            <p className="text-base md:text-lg font-medium opacity-80 leading-relaxed flex-grow">
              A TOR forensic platform that correlates entry/exit traffic using a DeepCorr-inspired engine (cross-correlation, KL divergence, cosine similarity), enriched with live Onionoo relay data. FastAPI + React/D3.js, backed by Scapy PCAP analysis.
            </p>
            <div className="flex flex-wrap gap-2">
              {['FastAPI', 'Scapy', 'D3.js', 'Onionoo', 'TOR'].map(t => (
                <span key={t} className="px-3 py-1.5 border border-current rounded-full text-[10px] font-mono uppercase tracking-widest">{t}</span>
              ))}
            </div>
          </div>

          {/* Project 3: VoiceShield AI */}
          <div
            className="border-b-2 border-r-2 border-current px-6 md:px-10 py-10 md:py-14 flex flex-col gap-6 hover:bg-black/[0.04] transition-colors duration-300 cursor-pointer group reveal"
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
            onClick={() => handleOpenModal(
              "VoiceShield AI",
              "Speaker-Specific Keyword Spotting",
              <div className="space-y-8 opacity-90 leading-relaxed pt-2">
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">1. Speaker-Conditioned Detection</h4>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>ECAPA-TDNN (Pruned):</strong> Pruned ECAPA-TDNN speaker encoder to extract a compact speaker embedding on-device.</li>
                    <li><strong>FiLM-Conditioned TCN:</strong> A temporal convolutional network conditioned via FiLM layers on the speaker embedding, so the model only fires on the target speaker's keywords.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">2. Edge Constraints</h4>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Sub-3M Parameters:</strong> Architected the full pipeline to stay under 3M params for on-device deployment.</li>
                    <li><strong>&lt;200ms Latency:</strong> Targeted sub-200ms inference for responsive, always-on wake-word behavior.</li>
                  </ul>
                </div>
              </div>
            )}
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-widest block opacity-60 mb-3">Edge ML</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold uppercase leading-tight tracking-tight flex items-start gap-3">VoiceShield AI <ArrowUpRight className="flex-shrink-0 opacity-0 -translate-y-1 -translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" /></h3>
            </div>
            <p className="text-base md:text-lg font-medium opacity-80 leading-relaxed flex-grow">
              An ultra-light, speaker-conditioned keyword detection pipeline targeting sub-3M parameters and under 200ms edge inference. Phase 1 blueprint for the Samsung AX (ennovateX) 2026 hackathon.
            </p>
            <div className="flex flex-wrap gap-2">
              {['PyTorch', 'ECAPA-TDNN', 'Edge ML', 'KWS'].map(t => (
                <span key={t} className="px-3 py-1.5 border border-current rounded-full text-[10px] font-mono uppercase tracking-widest">{t}</span>
              ))}
            </div>
          </div>

          {/* Project 4: Federated Learning Demo */}
          <div
            className="border-b-2 border-r-2 border-current px-6 md:px-10 py-10 md:py-14 flex flex-col gap-6 hover:bg-black/[0.04] transition-colors duration-300 cursor-pointer group reveal"
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
            onClick={() => handleOpenModal(
              "Federated Learning Demo",
              "Privacy-Preserving Model Training",
              <div className="space-y-8 opacity-90 leading-relaxed pt-2">
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">1. Federated Orchestration</h4>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Flower (flwr 1.30):</strong> Coordinated a central server and multiple clients, aggregating model updates with FedAvg over 12 communication rounds.</li>
                    <li><strong>PyTorch Models:</strong> Local training loops on each client; only weights, never raw data, left the client.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">2. IID vs Non-IID Benchmarking</h4>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Synthetic Data:</strong> Generated synthetic Gaussian-cluster datasets to control the data distribution across clients.</li>
                    <li><strong>Results:</strong> ~98% accuracy under IID splits and ~97% under non-IID splits, demonstrating robustness to heterogeneous client data.</li>
                  </ul>
                </div>
              </div>
            )}
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-widest block opacity-60 mb-3">Distributed ML</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold uppercase leading-tight tracking-tight flex items-start gap-3">Federated Learning Demo <ArrowUpRight className="flex-shrink-0 opacity-0 -translate-y-1 -translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" /></h3>
            </div>
            <p className="text-base md:text-lg font-medium opacity-80 leading-relaxed flex-grow">
              A federated learning pipeline using Flower and PyTorch that trains a shared model across distributed clients without centralizing data. Benchmarked across IID and non-IID data splits.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Flower', 'PyTorch', 'Federated Learning'].map(t => (
                <span key={t} className="px-3 py-1.5 border border-current rounded-full text-[10px] font-mono uppercase tracking-widest">{t}</span>
              ))}
            </div>
          </div>

          {/* Project 5: BRN-01 Burner Chat */}
          <div
            className="border-b-2 border-r-2 border-current px-6 md:px-10 py-10 md:py-14 flex flex-col gap-6 hover:bg-black/[0.04] transition-colors duration-300 cursor-pointer group reveal"
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
            onClick={() => handleOpenModal(
              "BRN-01 Burner Chat",
              "Ephemeral Real-Time Chat",
              <div className="space-y-8 opacity-90 leading-relaxed pt-2">
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">1. Ephemeral Architecture</h4>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Redis TTL Rooms:</strong> Rooms and messages stored in Redis with TTL expiry, so conversations self-destruct with no persistent history.</li>
                    <li><strong>WebSocket Layer:</strong> Real-time bidirectional messaging over WebSockets via a FastAPI backend.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">2. Frontend & Deployment</h4>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>React / Vite:</strong> A fast SPA frontend in the TE aesthetic (near-black, monospace, orange accents).</li>
                    <li><strong>Nginx + Docker Compose:</strong> Reverse-proxied and fully containerized for one-command deployment.</li>
                  </ul>
                </div>
              </div>
            )}
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-widest block opacity-60 mb-3">Full-Stack</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold uppercase leading-tight tracking-tight flex items-start gap-3">BRN-01 Burner Chat <ArrowUpRight className="flex-shrink-0 opacity-0 -translate-y-1 -translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" /></h3>
            </div>
            <p className="text-base md:text-lg font-medium opacity-80 leading-relaxed flex-grow">
              A disappearing-message chat app with TTL-based rooms and real-time WebSocket messaging, built in the Teenage Engineering visual language. Containerized end-to-end.
            </p>
            <div className="flex flex-wrap gap-2">
              {['FastAPI', 'Redis', 'WebSocket', 'React', 'Docker'].map(t => (
                <span key={t} className="px-3 py-1.5 border border-current rounded-full text-[10px] font-mono uppercase tracking-widest">{t}</span>
              ))}
            </div>
          </div>

          {/* Project 6: FaceAuthOffline */}
          <div
            className="border-b-2 border-r-2 border-current px-6 md:px-10 py-10 md:py-14 flex flex-col gap-6 hover:bg-black/[0.04] transition-colors duration-300 cursor-pointer group reveal"
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
            onClick={() => handleOpenModal(
              "FaceAuthOffline",
              "On-Device Face Auth & Liveness",
              <div className="space-y-8 opacity-90 leading-relaxed pt-2">
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">1. On-Device Recognition</h4>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>MobileFaceNet (INT8):</strong> TFLite MobileFaceNet INT8 for face embedding and matching entirely on-device.</li>
                    <li><strong>Geometric Liveness:</strong> EAR / MAR / Yaw geometric checks to defeat photo/replay spoofing without a server.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">2. Secure Offline Storage & Sync</h4>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Encrypted Local DB:</strong> WatermelonDB with AES-256 encryption for offline credential storage.</li>
                    <li><strong>Sync-and-Purge:</strong> Synced to AWS when connectivity returned, then purged local sensitive data.</li>
                  </ul>
                </div>
              </div>
            )}
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-widest block opacity-60 mb-3">Mobile & ML</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold uppercase leading-tight tracking-tight flex items-start gap-3">FaceAuthOffline <ArrowUpRight className="flex-shrink-0 opacity-0 -translate-y-1 -translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" /></h3>
            </div>
            <p className="text-base md:text-lg font-medium opacity-80 leading-relaxed flex-grow">
              An offline-first React Native facial authentication system with geometric liveness detection and on-device recognition — no network required at auth time. Built for Hackathon 7.0.
            </p>
            <div className="flex flex-wrap gap-2">
              {['React Native', 'TFLite', 'WatermelonDB', 'AWS'].map(t => (
                <span key={t} className="px-3 py-1.5 border border-current rounded-full text-[10px] font-mono uppercase tracking-widest">{t}</span>
              ))}
            </div>
          </div>

          {/* Project 7: Wear OS Health */}
          <div
            className="border-b-2 border-r-2 border-current px-6 md:px-10 py-10 md:py-14 flex flex-col gap-6 hover:bg-black/[0.04] transition-colors duration-300 cursor-pointer group reveal"
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
            onClick={() => handleOpenModal(
              "Wear OS Health",
              "Mobile & IoT Engineering",
              <div className="space-y-8 opacity-90 leading-relaxed pt-2">
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">1. Low-Latency Bluetooth Streaming</h4>
                  <p>Designed the data pipeline to handle the strict power and latency constraints of Wear OS smartwatch hardware.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Wearable Data Layer API:</strong> Used the ChannelClient API, optimized for continuous bidirectional data flows like heart rate (BPM) and accelerometer telemetry.</li>
                    <li><strong>Circular Buffer:</strong> Implemented a circular buffer on the watch side to decouple sensor output from transmission, preventing UI thread blocking and ensuring zero vital sign data was dropped.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">2. CRC & Hamming Code Error Correction</h4>
                  <p>Implemented two layers of error handling from scratch to guarantee transmission integrity over Bluetooth.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>CRC (Cyclic Redundancy Check):</strong> Implemented CRC to detect corrupted packets before they reached the Android receiver, triggering selective retransmission only when necessary.</li>
                    <li><strong>Hamming Code:</strong> Applied Hamming parity bits for single-bit error correction — automatically fixing bit-flip errors in transit without requiring a retransmit, achieving 99.9% reliability.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">3. Synchronized Bidirectional Communication</h4>
                  <p>Built a tight real-time sync loop between the wearable and the Android companion app.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Distributed State:</strong> Used DataClient to sync shared objects (goals, thresholds) across both devices — changes on the phone reflected instantly on the watch UI.</li>
                    <li><strong>Kotlin Coroutines & Flow:</strong> Observed the incoming Bluetooth stream using Kotlin Coroutines and Flow, allowing the UI to update reactively without blocking the main thread.</li>
                  </ul>
                </div>
              </div>
            )}
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-widest block opacity-60 mb-3">Mobile & IoT</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold uppercase leading-tight tracking-tight flex items-start gap-3">Wear OS Health <ArrowUpRight className="flex-shrink-0 opacity-0 -translate-y-1 -translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" /></h3>
            </div>
            <p className="text-base md:text-lg font-medium opacity-80 leading-relaxed flex-grow">
              Engineered a low-latency Bluetooth streaming protocol in Kotlin to transmit real-time vital signs from a Wear OS device to Android. Implemented CRC and Hamming Code error-correction algorithms from scratch, achieving 99.9% transmission reliability.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Kotlin', 'Wear OS', 'Bluetooth', 'Algorithms'].map(t => (
                <span key={t} className="px-3 py-1.5 border border-current rounded-full text-[10px] font-mono uppercase tracking-widest">{t}</span>
              ))}
            </div>
          </div>

          {/* Project 8: AWS Inventory */}
          <div
            className="border-b-2 border-r-2 border-current px-6 md:px-10 py-10 md:py-14 flex flex-col gap-6 hover:bg-black/[0.04] transition-colors duration-300 cursor-pointer group reveal"
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
            onClick={() => handleOpenModal(
              "AWS Inventory",
              "Full-Stack Cloud Architecture",
              <div className="space-y-8 opacity-90 leading-relaxed pt-2">
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">1. Full-Stack Architecture on AWS</h4>
                  <p>Migrated a manual, error-prone inventory process to a cloud-native application built for reliability and scale.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Flask REST API:</strong> Built the backend using Flask, exposing RESTful endpoints for all CRUD operations. Used SQLAlchemy as the ORM to interface cleanly with the MSSQL database.</li>
                    <li><strong>Dynamic Frontend:</strong> Developed a JavaScript dashboard with real-time search and filtering, and async form submissions to eliminate full-page reloads during high-volume data entry.</li>
                    <li><strong>AWS Deployment:</strong> Deployed on AWS EC2 with an Application Load Balancer to ensure availability during peak operational hours.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">2. MSSQL Schema Design & Data Integrity</h4>
                  <p>Replaced unstructured spreadsheets with a fully normalized relational database, making data corruption structurally impossible.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Schema Design:</strong> Designed a normalized MSSQL schema with Primary/Foreign Key constraints and Stored Procedures, eliminating phantom inventory and duplicate entries at the database level.</li>
                    <li><strong>Cloud RDS:</strong> Hosted the database on AWS RDS with automated backups, multi-AZ redundancy, and encrypted storage.</li>
                    <li><strong>Validation Logic:</strong> Reduced data entry errors by 85% through strict frontend and backend validation — regex for SKUs, enforced dropdowns, and mandatory field checks.</li>
                  </ul>
                </div>
              </div>
            )}
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-widest block opacity-60 mb-3">Full-Stack Cloud</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold uppercase leading-tight tracking-tight flex items-start gap-3">AWS Inventory <ArrowUpRight className="flex-shrink-0 opacity-0 -translate-y-1 -translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" /></h3>
            </div>
            <p className="text-base md:text-lg font-medium opacity-80 leading-relaxed flex-grow">
              Engineered and deployed a full-stack inventory management application on AWS using Flask and a cloud-hosted MSSQL database. Designed a normalized schema and strict validation logic that reduced data entry errors by 85%.
            </p>
            <div className="flex flex-wrap gap-2">
              {['AWS', 'Flask', 'MSSQL', 'Web App'].map(t => (
                <span key={t} className="px-3 py-1.5 border border-current rounded-full text-[10px] font-mono uppercase tracking-widest">{t}</span>
              ))}
            </div>
          </div>

          {/* Project 9: Retail Regression Engine */}
          <div
            className="border-b-2 border-r-2 border-current px-6 md:px-10 py-10 md:py-14 flex flex-col gap-6 hover:bg-black/[0.04] transition-colors duration-300 cursor-pointer group reveal"
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
            onClick={() => handleOpenModal(
              "Retail Regression Engine",
              "Machine Learning & NLP",
              <div className="space-y-8 opacity-90 leading-relaxed pt-2">
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">1. NLP-Driven Feature Extraction</h4>
                  <p>Treated unstructured product descriptions as a primary signal rather than relying solely on categorical metadata.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>TF-IDF Vectorization:</strong> Applied TF-IDF to convert raw product descriptions into numerical feature vectors, allowing the model to recognize that terms like "OLED," "Leica-engineered," or "Premium" carry significant price weight.</li>
                    <li><strong>Feature Engineering:</strong> Extracted additional signals including description length, brand tier, and presence of keywords like "Warranty" or "Authentic" to build a rich multi-dimensional feature set.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">2. SMAPE-Optimized Training</h4>
                  <p>Chose SMAPE as the evaluation metric to handle the massive price variance across product categories fairly.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>SMAPE:</strong> Optimized for Symmetric Mean Absolute Percentage Error so the model was penalized proportionally — a $10 error on a $15 product is treated as far worse than the same error on a $1,500 laptop.</li>
                    <li><strong>Log Transformation:</strong> Applied log(y) to the target price variable to stabilize variance and improve regression convergence across heavily skewed pricing distributions.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">3. Robust Pipeline & Outlier Handling</h4>
                  <p>Built a clean, leakage-free ML pipeline to handle the noise inherent in real-world e-commerce data.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Outlier Removal:</strong> Applied IQR filtering and Z-score analysis to prune anomalous price points that would have skewed the regression line away from the true distribution.</li>
                    <li><strong>Leakage-Free Design:</strong> Automated feature scaling and categorical encoding with strict train/test separation to guarantee zero data leakage between pipeline stages.</li>
                    <li><strong>Result:</strong> Achieved 92% pricing accuracy across 15+ product categories using SMAPE-optimized regression combined with NLP-based feature extraction.</li>
                  </ul>
                </div>
              </div>
            )}
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-widest block opacity-60 mb-3">ML & Applied AI</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold uppercase leading-tight tracking-tight flex items-start gap-3">Retail Regression Engine <ArrowUpRight className="flex-shrink-0 opacity-0 -translate-y-1 -translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" /></h3>
            </div>
            <p className="text-base md:text-lg font-medium opacity-80 leading-relaxed flex-grow">
              Developed an ML regression pipeline to predict retail product prices from unstructured text descriptions and metadata. Applied TF-IDF vectorization and SMAPE-optimized training to achieve 92% pricing accuracy across 15+ product categories.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Python', 'Scikit-Learn', 'NLP', 'TF-IDF'].map(t => (
                <span key={t} className="px-3 py-1.5 border border-current rounded-full text-[10px] font-mono uppercase tracking-widest">{t}</span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER / CONTACT */}
      <section id="contact-section" className="snap-element min-h-[90vh] w-full flex flex-col justify-between py-24 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-5">
          <h2 className="font-display text-[20vw] font-bold uppercase leading-none tracking-tighter">BUILD</h2>
        </div>

        <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col justify-center items-center z-10 text-center reveal">
          <h2 className="font-display text-6xl md:text-[8vw] font-bold uppercase tracking-tighter leading-none mb-8">
            Let's build<br/>something.
          </h2>
          <p className="text-xl md:text-2xl font-medium mb-12 max-w-2xl px-4">
            Currently open for new opportunities, collaborations, and discussions about edge compute architecture.
          </p>
          
          <a 
            href="https://mail.google.com/mail/?view=cm&fs=1&to=sharishsasi@gmail.com"
            target="_blank"
            rel="noreferrer"
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
            <a href="https://music.apple.com/profile/sharishsk20" target="_blank" rel="noreferrer" onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverLeave} className="flex items-center gap-2 font-mono text-xs md:text-sm uppercase tracking-widest hover:opacity-60 transition-opacity">
              <Music size={18} /> Music
            </a>
            <a href="https://github.com/sharishsk20" target="_blank" rel="noreferrer" onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverLeave} className="flex items-center gap-2 font-mono text-xs md:text-sm uppercase tracking-widest hover:opacity-60 transition-opacity">
              <Github size={18} /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/sharishsk20" target="_blank" rel="noreferrer" onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverLeave} className="flex items-center gap-2 font-mono text-xs md:text-sm uppercase tracking-widest hover:opacity-60 transition-opacity">
              <Linkedin size={18} /> LinkedIn
            </a>
            <a href="#" onClick={handleCopyEmail} onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverLeave} className="flex items-center gap-2 font-mono text-xs md:text-sm uppercase tracking-widest hover:opacity-60 transition-opacity">
              <Mail size={18} /> {emailCopied ? "Copied!" : "Email"}
            </a>
            <a href="https://drive.google.com/file/d/1SlSn4w2Jnz1ppWUdljEZat0nGixxVEA-/view?usp=sharing" target="_blank" rel="noreferrer" onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverLeave} className="flex items-center gap-2 font-mono text-xs md:text-sm uppercase tracking-widest hover:opacity-60 transition-opacity text-[#DE5D26] bg-black dark:text-black dark:bg-[#F4F1EA] px-4 py-2 rounded-full border border-current">
              <FileText size={18} /> Resume
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
