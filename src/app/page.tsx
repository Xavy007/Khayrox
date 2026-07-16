"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, Variants } from "framer-motion";

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);

  // Floating elements parallax
  const float1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-200%"]);
  const float2Y = useTransform(scrollYProgress, [0, 1], ["0%", "300%"]);
  const float3Y = useTransform(scrollYProgress, [0, 1], ["0%", "-150%"]);

  // Mouse Spotlight Effect for Hero
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Card 3D Tilt Effect State
  const handleTilt = (e: React.MouseEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
    const rotateY = ((x - centerX) / centerX) * 10;

    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleTiltLeave = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;
    ref.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  // Animations variants
  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <main className="flex-1 flex flex-col bg-[#050914] overflow-hidden" ref={containerRef}>

      {/* HERO PARALLAX & SPOTLIGHT SECTION */}
      <section className="relative w-full h-[100vh] min-h-[800px] flex items-center justify-center overflow-hidden">

        {/* Mouse Spotlight */}
        <motion.div
          className="pointer-events-none fixed inset-0 z-0 opacity-50 mix-blend-screen transition-opacity duration-300"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                600px circle at ${mouseX}px ${mouseY}px,
                rgba(0, 212, 255, 0.15),
                transparent 80%
              )
            `,
          }}
        />

        {/* Deep Grid Parallax */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]" />
        </motion.div>

        {/* Floating Geometric Elements (Abstract products) */}
        <motion.div style={{ y: float1Y }} className="absolute top-[20%] left-[10%] z-0 hidden lg:block opacity-30">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-primary/40 to-transparent border border-primary/20 backdrop-blur-md animate-[spin_20s_linear_infinite] shadow-[0_0_50px_rgba(0,212,255,0.2)]" />
        </motion.div>

        <motion.div style={{ y: float2Y }} className="absolute bottom-[20%] right-[10%] z-0 hidden lg:block opacity-30">
          <div className="w-40 h-40 rounded-full bg-gradient-to-bl from-secondary/40 to-transparent border border-secondary/20 backdrop-blur-md animate-[pulse_10s_ease-in-out_infinite] shadow-[0_0_50px_rgba(255,0,255,0.2)]" />
        </motion.div>

        <motion.div style={{ y: float3Y }} className="absolute top-[60%] left-[80%] z-0 hidden lg:block opacity-20">
          <div className="w-24 h-24 rotate-45 bg-gradient-to-r from-accent/40 to-transparent border border-accent/20 backdrop-blur-md animate-[spin_15s_linear_infinite_reverse] shadow-[0_0_50px_rgba(255,255,0,0.2)]" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          className="container px-4 md:px-6 relative z-10 mx-auto max-w-6xl text-center flex flex-col items-center"
          style={{ y: textY }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.5 }}
            className="group relative inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-10 backdrop-blur-xl overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-x-[200%] group-hover:animate-[shimmer_2s_infinite]" />
            <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse mr-3 shadow-[0_0_10px_rgba(0,212,255,1)]"></span>
            <span className="font-medium tracking-wide">Descubre la Nueva Colección 2026</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white font-orbitron mb-6 leading-tight"
          >
            KHAYROX <br />

          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-[800px] text-slate-300 md:text-xl lg:text-2xl font-light mb-12 leading-relaxed"
          >
            En <strong className="text-white font-orbitron">KHAYROX</strong> transformamos tus ideas en piezas únicas que se sienten tanto como se ven.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
          >
            <Link
              href="/catalogo"
              className="group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-blue-500 px-10 font-bold text-[#050914] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(0,212,255,0.8)]"
            >
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
                <div className="relative h-full w-12 bg-white/40 blur-sm" />
              </div>
              <span className="relative text-lg tracking-widest uppercase">Ver Catálogo</span>
            </Link>

            <Link
              href="/cotizador"
              className="group relative inline-flex h-16 items-center justify-center rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl px-10 font-bold text-white transition-all duration-300 hover:bg-white/10 hover:border-primary/50 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              <span className="relative text-lg tracking-widest uppercase flex items-center gap-2 group-hover:text-primary transition-colors">
                Cotizar Proyecto
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* PHILOSOPHY SECTION (NEW) */}
      <section className="relative w-full py-32 md:py-48 z-10 border-t border-white/5 bg-[#030610] overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-[100%] blur-[120px] pointer-events-none" />

        <div className="container px-4 md:px-6 mx-auto max-w-5xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="flex flex-col items-center justify-center text-center space-y-10"
          >
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300 backdrop-blur-xl">
              <span className="font-medium tracking-[0.2em] uppercase text-xs">Nuestra Filosofía</span>
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-serif italic leading-tight max-w-4xl">
              "Brindamos <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">más que un producto</span>; creamos un detalle que marca la diferencia en cualquier momento."
            </h2>

            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 text-left">
              <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed">
                Entendemos que detrás de cada pedido hay una historia, una celebración o un hito irrepetible. Nuestro objetivo principal no es solo imprimir o cortar materiales, sino ser el puente entre tu imaginación y ese recuerdo imborrable.
              </p>
              <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed">
                Lo que realmente nos hace diferentes frente a cualquier eventualidad es nuestra empatía y compromiso. Tu tranquilidad es nuestra prioridad. Cada pieza única que sale de nuestro taller lleva consigo la promesa de calidad, cuidado y atención absoluta al detalle.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SCROLL REVEAL FEATURES SECTION */}
      <section className="relative w-full py-32 bg-surface/30 z-10 border-t border-primary/10">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="flex flex-col items-center justify-center space-y-6 text-center mb-24"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white font-orbitron">
              Tecnología <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Avanzada</span>
            </h2>
            <p className="max-w-[700px] text-slate-400 md:text-xl font-light">
              Nuestros procesos de personalización fusionan arte y tecnología industrial para ofrecer acabados inigualables.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {/* Card 1 */}
            <motion.div variants={fadeIn} className="perspective-1000">
              <div
                ref={card1Ref}
                onMouseMove={(e) => handleTilt(e, card1Ref)}
                onMouseLeave={() => handleTiltLeave(card1Ref)}
                className="group relative h-full rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-8 backdrop-blur-2xl transition-transform duration-200 ease-out hover:border-primary/50 hover:shadow-[0_20px_50px_rgba(0,212,255,0.15)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-primary to-transparent opacity-0 group-hover:opacity-20 blur transition duration-500" style={{ transform: "translateZ(-10px)" }} />

                <div style={{ transform: "translateZ(30px)" }}>
                  <div className="mb-8 inline-flex p-4 rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/30 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white font-orbitron group-hover:text-primary transition-colors">Sublimación</h3>
                  <p className="text-slate-400 leading-relaxed text-lg font-light">
                    Transferencia molecular de pigmentos. Colores de rango completo integrados directamente en la fibra, garantizando una duración eterna sin tacto.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={fadeIn} className="perspective-1000">
              <div
                ref={card2Ref}
                onMouseMove={(e) => handleTilt(e, card2Ref)}
                onMouseLeave={() => handleTiltLeave(card2Ref)}
                className="group relative h-full rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-8 backdrop-blur-2xl transition-transform duration-200 ease-out hover:border-secondary/50 hover:shadow-[0_20px_50px_rgba(255,0,255,0.15)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-secondary to-transparent opacity-0 group-hover:opacity-20 blur transition duration-500" style={{ transform: "translateZ(-10px)" }} />

                <div style={{ transform: "translateZ(30px)" }}>
                  <div className="mb-8 inline-flex p-4 rounded-2xl bg-secondary/10 text-secondary ring-1 ring-secondary/30 shadow-[0_0_20px_rgba(255,0,255,0.2)]">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white font-orbitron group-hover:text-secondary transition-colors">Serigrafía</h3>
                  <p className="text-slate-400 leading-relaxed text-lg font-light">
                    El estándar industrial. Pantallas de alta tensión para depositar capas ricas de tintas curables por calor, logrando texturas y efectos únicos.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={fadeIn} className="perspective-1000">
              <div
                ref={card3Ref}
                onMouseMove={(e) => handleTilt(e, card3Ref)}
                onMouseLeave={() => handleTiltLeave(card3Ref)}
                className="group relative h-full rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-8 backdrop-blur-2xl transition-transform duration-200 ease-out hover:border-accent/50 hover:shadow-[0_20px_50px_rgba(255,255,0,0.15)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-accent to-transparent opacity-0 group-hover:opacity-20 blur transition duration-500" style={{ transform: "translateZ(-10px)" }} />

                <div style={{ transform: "translateZ(30px)" }}>
                  <div className="mb-8 inline-flex p-4 rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/30 shadow-[0_0_20px_rgba(255,255,0,0.2)]">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white font-orbitron group-hover:text-accent transition-colors">Corte Láser</h3>
                  <p className="text-slate-400 leading-relaxed text-lg font-light">
                    Haces de luz concentrada para cortes con tolerancia cero. Bordes pulidos y grabados milimétricos controlados por software CNC.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* IMMERSIVE ANIMATED CTA */}
      <section className="relative w-full py-40 overflow-hidden bg-background">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: "spring", bounce: 0.3 }}
          className="container px-4 md:px-6 mx-auto max-w-5xl relative z-10"
        >
          <div className="relative overflow-hidden rounded-[3rem] border border-primary/30 bg-surface/40 backdrop-blur-3xl p-16 md:p-24 text-center shadow-[0_0_100px_rgba(0,212,255,0.1)]">
            {/* Animated internal gradient */}
            <div className="absolute -inset-[100%] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#00d4ff_100%)] opacity-20 animate-[spin_5s_linear_infinite]" />
            <div className="absolute inset-[2px] bg-surface/90 rounded-[calc(3rem-2px)] backdrop-blur-3xl" />

            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white font-orbitron mb-8">
                El Futuro de tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Marca</span>
              </h2>
              <p className="text-slate-400 text-xl max-w-2xl mb-12 font-light leading-relaxed">
                Únete a las empresas que ya están transformando su identidad visual con nuestras soluciones de personalización de alto rendimiento.
              </p>

              <Link
                href="/cotizador"
                className="group relative inline-flex h-20 items-center justify-center overflow-hidden rounded-full bg-primary px-16 font-bold text-[#050914] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_80px_rgba(0,212,255,0.6)]"
              >
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
                  <div className="relative h-full w-20 bg-white/40 blur-sm" />
                </div>
                <span className="relative text-2xl tracking-widest uppercase flex items-center gap-4">
                  Empezar Ahora
                  <div className="bg-[#050914] text-primary p-2 rounded-full transition-transform group-hover:translate-x-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
