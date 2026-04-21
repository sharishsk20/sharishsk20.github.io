import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ArrowDownRight, ArrowUpRight, Github, Linkedin, Mail, FileText, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [cursorVariant, setCursorVariant] = useState('default');
  const [modalContent, setModalContent] = useState<{title: string, subtitle?: string, content: React.ReactNode} | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

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
          duration: { min: 0.2, max: 0.5 },
          delay: 0.15,
          ease: "power1.inOut"
        }
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
    // Stop body scrolling on modal open
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setModalContent(null);
    // Restore body scrolling
    document.body.style.overflow = 'auto';
  };

  return (
    <div ref={containerRef} className="relative w-full min-h-screen pb-[env(safe-area-inset-bottom)]">
      
      {/* MODAL OVERLAY */}
      {modalContent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md" onClick={handleCloseModal}>
          <div 
            className="bg-[#F4F1EA] text-[#1C1B1A] p-8 md:p-12 rounded-[2rem] max-w-4xl w-full max-h-[85vh] overflow-y-auto relative shadow-2xl" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="absolute top-6 right-6 p-2 bg-black/10 rounded-full hover:bg-black/20 transition-colors"
              onClick={handleCloseModal}
            >
              <X size={24} />
            </button>
            <h3 className="font-display text-4xl md:text-5xl border-b border-black/20 pb-4 font-bold uppercase mb-4">{modalContent.title}</h3>
            {modalContent.subtitle && <p className="font-mono text-sm md:text-base opacity-70 mb-8 border-l-2 border-[#DE5D26] pl-4">{modalContent.subtitle}</p>}
            <div className="font-medium text-base md:text-lg">
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

        {/* Experience Block - Now a click to open modal */}
        <div className="snap-element min-h-[50vh] py-24 px-6 md:px-12 flex flex-col justify-center max-w-7xl mx-auto w-full">
          <div 
            className="p-8 md:p-12 border border-current rounded-[2rem] hover:bg-[#F4F1EA] hover:text-[#1C1B1A] transition-colors duration-500 cursor-pointer group"
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
        <div className="snap-element min-h-[40vh] pt-48 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full flex justify-between items-end">
          <h2 className="font-display text-5xl md:text-8xl font-bold uppercase tracking-tighter leading-none">Selected<br/>Works</h2>
          <span className="font-mono text-xs md:text-sm uppercase border-b border-current pb-2 opacity-80">2023 — Present</span>
        </div>

        <div className="flex flex-col border-t-2 border-current px-6 md:px-12 max-w-7xl mx-auto w-full">
          
          {/* Project 1 */}
          <div 
            className="snap-element py-24 md:py-32 border-b border-current flex flex-col md:flex-row gap-8 justify-between hover:pl-4 transition-all duration-300 cursor-pointer group" 
            onMouseEnter={handleHoverEnter} 
            onMouseLeave={handleHoverLeave}
            onClick={() => handleOpenModal(
              "Cloud-Edge IDS",
              "Edge & AI Architecture",
              <div className="space-y-8 opacity-90 leading-relaxed pt-2">
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">1. Edge Auditor & Resource Management</h4>
                  <p>In a resource-constrained environment like a Raspberry Pi, "architecting" isn't just about running code; it’s about optimization.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Workload Orchestration:</strong> Since you are using K3s (lightweight Kubernetes), your "auditor" likely functions as a containerized microservice. It monitors CPU and RAM usage to ensure the Random Forest inference doesn't starve other critical system processes.</li>
                    <li><strong>Data Pre-processing:</strong> The auditor acts as a gatekeeper. Instead of sending full packet captures (PCAPs) to the cloud, it extracts key features (like flow duration, protocol type, and byte counts) at the edge. This reduces the data footprint by over 90%.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">2. Localized Random Forest Inference</h4>
                  <p>Random Forest is an excellent choice for edge IDS because it provides a high balance between accuracy and computational efficiency.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Model Quantization:</strong> To make the model run faster on the Pi’s ARM architecture, you can use libraries like sklearn-porter or convert the model to a TFLite format to reduce memory overhead.</li>
                    <li><strong>Real-time Detection:</strong> The system captures live network traffic via Scapy or PyShark. The Random Forest model then classifies these flows as "Benign" or "Malicious" (e.g., DoS, Port Scanning, or Brute Force) in milliseconds.</li>
                    <li><strong>Localized Decision Making:</strong> If a threat is detected, the Pi can trigger an immediate local response—such as updating an iptables rule to drop the malicious IP—without waiting for a round-trip command from the cloud.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">3. Secure Cloud Synchronization</h4>
                  <p>The "Cloud" side of your C-IDS serves as the long-term brain and global dashboard.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Asynchronous Logging:</strong> Only "Alerts" and "Telemetry Summaries" are synced to the cloud via secure protocols like MQTT (with TLS) or HTTPS. This keeps the sync "secure" and "lightweight."</li>
                    <li><strong>Global Model Retraining:</strong> While the Pi handles detection, the cloud handles learning. Periodically, the cloud can aggregate anonymized data from multiple edge nodes to retrain the Random Forest model and push updated weights back to the Pi (Federated Learning approach).</li>
                  </ul>
                </div>
              </div>
            )}
          >
            <div className="md:w-5/12">
              <span className="font-mono text-xs md:text-sm uppercase tracking-widest block opacity-60 mb-4">Edge & AI</span>
              <h3 className="font-display text-4xl md:text-6xl font-bold uppercase leading-tight tracking-tight flex items-center gap-4">Cloud-Edge IDS <ArrowUpRight className="hidden md:inline-block opacity-0 -translate-y-2 -translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" /></h3>
            </div>
            <div className="md:w-6/12 flex flex-col justify-center mt-4 md:mt-0">
              <p className="text-lg md:text-xl font-medium opacity-80 leading-relaxed mb-8">
                Architected an edge auditor deployed on Raspberry Pi hardware to effectively manage AI workloads. Implemented Random Forest algorithms for real-time, localized intrusion detection. <span className="opacity-50 italic text-sm">(Click for deep dive)</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {['Raspberry Pi', 'Random Forest', 'Cloud Architecture'].map(t => (
                  <span key={t} className="px-4 py-2 border border-current rounded-full text-[10px] md:text-xs font-mono uppercase tracking-widest">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Project 2 */}
          <div 
            className="snap-element py-24 md:py-32 border-b border-current flex flex-col md:flex-row gap-8 justify-between hover:pl-4 transition-all duration-300 cursor-pointer group" 
            onMouseEnter={handleHoverEnter} 
            onMouseLeave={handleHoverLeave}
            onClick={() => handleOpenModal(
              "Project Unveil",
              "Cybersecurity & Forensics",
              <div className="space-y-8 opacity-90 leading-relaxed pt-2">
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">1. TOR Forensic Framework & De-anonymization</h4>
                  <p>De-anonymizing a TOR user is rarely about "breaking" the encryption; it is usually about correlation and side-channel analysis.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Traffic Correlation (End-to-End):</strong> Your framework likely focuses on "Traffic Confirmation" attacks. By auditing traffic at both the Entry Guard (where the user enters) and the Exit Node (where they leave), you can use timing analysis and packet size patterns to correlate a specific user to a specific destination.</li>
                    <li><strong>Stem Integration:</strong> Using the Stem library, your framework can programmatically interact with the local TOR controller. This allows you to monitor circuit creation events, query the consensus to map relays, and attach to streams.</li>
                    <li><strong>Protocol Analysis:</strong> The framework audits how complex protocols (like HTTP, DNS, or SSH) leak information before they even enter the TOR circuit—for example, analyzing DNS leaks that bypass the proxy.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">2. Automated Data Processing Pipelines</h4>
                  <p>Handling TOR telemetry is a "Big Data" problem because of the sheer volume of noise and encrypted overhead.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>The Python/Bash Hybrid:</strong> You likely use Bash for high-speed packet capture (via tcpdump or tshark) and Python as the "intelligence" layer to parse raw PCAP files, extract features, and transform them into JSON or CSV.</li>
                    <li><strong>High-Volume Handling:</strong> To manage "high-volume network telemetry," your pipeline might implement a producer-consumer pattern. This ensures data ingestion doesn't lag behind live network traffic, critical for maintaining the chain of custody.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">3. Ethical and Forensic Considerations</h4>
                  <p>Emphasizing the audit and educational nature of this project is key for digital forensics.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Testbed Environment:</strong> You likely run this within a controlled environment (like Chutney or Shadow) rather than the live public TOR network to avoid ethical violations.</li>
                    <li><strong>Artifact Documentation:</strong> The framework doesn't just "detect"; it generates forensic reports that document the path, timestamps, and relay fingerprints, which are essential for digital investigators.</li>
                  </ul>
                </div>
              </div>
            )}
          >
            <div className="md:w-5/12">
              <span className="font-mono text-xs md:text-sm uppercase tracking-widest block opacity-60 mb-4">Cybersecurity</span>
              <h3 className="font-display text-4xl md:text-6xl font-bold uppercase leading-tight tracking-tight flex items-center gap-4">Project Unveil <ArrowUpRight className="hidden md:inline-block opacity-0 -translate-y-2 -translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" /></h3>
            </div>
            <div className="md:w-6/12 flex flex-col justify-center mt-4 md:mt-0">
              <p className="text-lg md:text-xl font-medium opacity-80 leading-relaxed mb-8">
                Comprehensive forensic framework analyzing complex network protocols to audit TOR network traffic for de-anonymization using advanced Python and Bash scripting. <span className="opacity-50 italic text-sm">(Click for deep dive)</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {['Python', 'Bash Scripting', 'Network Protocols', 'TOR'].map(t => (
                  <span key={t} className="px-4 py-2 border border-current rounded-full text-[10px] md:text-xs font-mono uppercase tracking-widest">{t}</span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Project 3 */}
          <div 
            className="snap-element py-24 md:py-32 border-b border-current flex flex-col md:flex-row gap-8 justify-between hover:pl-4 transition-all duration-300 cursor-pointer group" 
            onMouseEnter={handleHoverEnter} 
            onMouseLeave={handleHoverLeave}
            onClick={() => handleOpenModal(
              "AWS Inventory",
              "Full-stack Cloud Architecture",
              <div className="space-y-8 opacity-90 leading-relaxed pt-2">
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">1. Full-Stack Architecture on AWS</h4>
                  <p>Transitioning a business from "manual legacy workflows" to a cloud-native app requires a focus on uptime and accessibility.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>The Flask Backend:</strong> You likely utilized Flask as a RESTful API to handle CRUD operations. This would involve using SQLAlchemy as an ORM to interface with the database, ensuring that inventory logic is handled server-side.</li>
                    <li><strong>The Frontend (JavaScript):</strong> Built a dynamic dashboard featuring real-time search/filtering for stock items and asynchronous form submissions to prevent page reloads during high-volume data entry.</li>
                    <li><strong>Deployment:</strong> Chose AWS Elastic Beanstalk or EC2 with an ALB (Application Load Balancer) to ensure the application remains reachable even during peak operational hours.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">2. MSSQL Integration & Data Integrity</h4>
                  <p>Replacing manual workflows with a relational database is the "hero" of this story.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Schema Design:</strong> Replaced unstructured data with a normalized MSSQL schema. By implementing Primary/Foreign Key constraints and Stored Procedures, you ensured that "phantom inventory" or duplicate entries became technically impossible.</li>
                    <li><strong>Cloud RDS:</strong> Hosted the MSSQL instance on AWS RDS, providing automated backups, multi-AZ redundancy, and encrypted storage.</li>
                    <li><strong>Validation Logic:</strong> The 85% reduction in errors was achieved by implementing strict frontend and backend validation (e.g., regex for SKUs, dropdowns instead of free-text fields, and mandatory fields).</li>
                  </ul>
                </div>
              </div>
            )}
          >
            <div className="md:w-5/12">
              <span className="font-mono text-xs md:text-sm uppercase tracking-widest block opacity-60 mb-4">Full-stack Cloud</span>
              <h3 className="font-display text-4xl md:text-6xl font-bold uppercase leading-tight tracking-tight flex items-center gap-4">AWS Inventory <ArrowUpRight className="hidden md:inline-block opacity-0 -translate-y-2 -translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" /></h3>
            </div>
            <div className="md:w-6/12 flex flex-col justify-center mt-4 md:mt-0">
              <p className="text-lg md:text-xl font-medium opacity-80 leading-relaxed mb-8">
                Engineered and deployed a full-stack web application on AWS with Flask and a cloud-hosted MSSQL database, resulting in an 85% reduction in data entry errors. <span className="opacity-50 italic text-sm">(Click for deep dive)</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {['AWS', 'Flask', 'MSSQL', 'Web App'].map(t => (
                  <span key={t} className="px-4 py-2 border border-current rounded-full text-[10px] md:text-xs font-mono uppercase tracking-widest">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Project 4 */}
          <div 
            className="snap-element py-24 md:py-32 border-b border-current flex flex-col md:flex-row gap-8 justify-between hover:pl-4 transition-all duration-300 cursor-pointer group" 
            onMouseEnter={handleHoverEnter} 
            onMouseLeave={handleHoverLeave}
            onClick={() => handleOpenModal(
              "Wear OS Health",
              "Mobile & IoT Engineering",
              <div className="space-y-8 opacity-90 leading-relaxed pt-2">
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">1. Low-Latency Bluetooth Streaming</h4>
                  <p>Smartwatches have limited battery and processing power, making "real-time" streaming a significant challenge.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>The Data Layer:</strong> You utilized the Wearable Data Layer API (ChannelClient) which is optimized for continuous data flow like heart rate (BPM) or accelerometer telemetry.</li>
                    <li><strong>Buffer Management:</strong> Implemented a circular buffer on the watch side to prevent the UI thread from hanging, ensuring vital signs dispatch as soon as the sensor generates them.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">2. Low-Level Integrity: CRC & Hamming Code</h4>
                  <p>Moving from "standard app development" into "systems engineering" by adding secondary validation.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>CRC (Cyclic Redundancy Check):</strong> Implemented CRC to detect accidental changes to raw data, verifying if a packet was corrupted during transmission.</li>
                    <li><strong>Hamming Code:</strong> Used parity bits for Error Correction, identifying single-bit errors and flipping them back to the correct state without retransmission to achieve 99.9% reliability.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">3. Synchronized Bidirectional Communication</h4>
                  <p>Creating a tight loop between the wearable and the handheld device.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Distributed State:</strong> Used DataClient to sync objects (like goals) across nodes. When settings change on the phone, the watch UI updates instantly.</li>
                    <li><strong>Live UI Updates:</strong> Used Kotlin Coroutines and Flow to observe the incoming Bluetooth stream, allowing the UI to react without blocking the main thread.</li>
                  </ul>
                </div>
              </div>
            )}
          >
            <div className="md:w-5/12">
              <span className="font-mono text-xs md:text-sm uppercase tracking-widest block opacity-60 mb-4">Mobile & IoT</span>
              <h3 className="font-display text-4xl md:text-6xl font-bold uppercase leading-tight tracking-tight flex items-center gap-4">Wear OS Health <ArrowUpRight className="hidden md:inline-block opacity-0 -translate-y-2 -translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" /></h3>
            </div>
            <div className="md:w-6/12 flex flex-col justify-center mt-4 md:mt-0">
              <p className="text-lg md:text-xl font-medium opacity-80 leading-relaxed mb-8">
                Engineered a low-latency data streaming protocol to transmit real-time vital signs via Bluetooth using Kotlin, implementing CRC and Hamming Code algorithms for 99.9% reliable transmission. <span className="opacity-50 italic text-sm">(Click for deep dive)</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {['Kotlin', 'Wear OS', 'Bluetooth', 'Algorithms'].map(t => (
                  <span key={t} className="px-4 py-2 border border-current rounded-full text-[10px] md:text-xs font-mono uppercase tracking-widest">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Project 5 (NEW) */}
          <div 
            className="snap-element py-24 md:py-32 flex flex-col md:flex-row gap-8 justify-between hover:pl-4 transition-all duration-300 cursor-pointer group" 
            onMouseEnter={handleHoverEnter} 
            onMouseLeave={handleHoverLeave}
            onClick={() => handleOpenModal(
              "Price Prediction Model",
              "Machine Learning & NLP",
              <div className="space-y-8 opacity-90 leading-relaxed pt-2">
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">1. NLP-Driven Feature Extraction</h4>
                  <p>Instead of just using categorical data, you treated the Product Description as a primary data source.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Text Vectorization:</strong> Utilized TF-IDF (Term Frequency-Inverse Document Frequency) or Word2Vec/Doc2Vec to convert unstructured descriptions into numerical vectors. This allowed the model to understand that terms like "Premium," "Leica-engineered," or "OLED" carry significant price premiums compared to "Standard" or "LCD."</li>
                    <li><strong>Sentiment and Metadata:</strong> Extracted features such as description length, the presence of specific keywords (e.g., "Warranty," "Authentic"), and brand tiers to create a multi-dimensional feature set.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">2. Optimization for SMAPE</h4>
                  <p>In price prediction, standard metrics like RMSE can be misleading because a $100 error on a $1,000 laptop is minor, but a $100 error on a $10 USB cable is catastrophic.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>SMAPE:</strong> By choosing SMAPE as your loss function/evaluation metric, you ensured the model was penalized based on the relative percentage of the error. This makes the model equally effective for low-cost items and high-end luxury goods.</li>
                    <li><strong>Log Transformation:</strong> Applied a log(y) transformation to the target variable to stabilize the variance and improve regression convergence for pricing distributions.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#DE5D26]">3. Robust Feature Engineering</h4>
                  <p>E-commerce data contains outliers, typos, and massive variance.</p>
                  <ul className="list-disc pl-6 mt-4 space-y-3 marker:text-black/50">
                    <li><strong>Handling Outliers:</strong> Used Interquartile Range (IQR) filtering or Z-score analysis to prune anomalous data points that would otherwise pull the regression line away from the median.</li>
                    <li><strong>Pipeline Design:</strong> Automated scaling of numerical features and encoding of categorical features with strict separation to ensure zero data leakage.</li>
                    <li><strong>Key Achievement:</strong> Improved pricing accuracy significantly by implementing custom SMAPE-optimized regression and NLP-based feature extraction across 15+ product categories.</li>
                  </ul>
                </div>
              </div>
            )}
          >
            <div className="md:w-5/12">
              <span className="font-mono text-xs md:text-sm uppercase tracking-widest block opacity-60 mb-4">ML & Applied AI</span>
              <h3 className="font-display text-4xl md:text-6xl font-bold uppercase leading-tight tracking-tight flex items-center gap-4">Amazon Price Predictor <ArrowUpRight className="hidden md:inline-block opacity-0 -translate-y-2 -translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" /></h3>
            </div>
            <div className="md:w-6/12 flex flex-col justify-center mt-4 md:mt-0">
              <p className="text-lg md:text-xl font-medium opacity-80 leading-relaxed mb-8">
                Developed a machine learning regression model to predict e-commerce product prices based on text descriptions and metadata using NLP. Achieved high pricing accuracy (92%) while minimizing SMAPE across 15+ categories. <span className="opacity-50 italic text-sm">(Click for deep dive)</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {['Python', 'Scikit-Learn', 'NLP', 'TF-IDF'].map(t => (
                  <span key={t} className="px-4 py-2 border border-current rounded-full text-[10px] md:text-xs font-mono uppercase tracking-widest">{t}</span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER / CONTACT */}
      <section id="contact-section" className="snap-element min-h-[90vh] w-full flex flex-col justify-between py-24 px-6 md:px-12 relative overflow-hidden">
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
            <a href="#" onMouseEnter={handleHoverEnter} onMouseLeave={handleHoverLeave} className="flex items-center gap-2 font-mono text-xs md:text-sm uppercase tracking-widest hover:opacity-60 transition-opacity text-[#DE5D26] bg-black dark:text-black dark:bg-[#F4F1EA] px-4 py-2 rounded-full border border-current">
              <FileText size={18} /> Resume
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
