"use client";

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const getTotalItems = useCartStore(state => state.getTotalItems);
  const [mounted, setMounted] = useState(false);

  const technique = searchParams?.get('technique');
  const isCatalogActive = pathname === '/catalogo' && !technique;
  const isLaserActive = pathname === '/catalogo' && technique === 'laser';
  const isSublimationActive = pathname === '/catalogo' && technique === 'sublimacion';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Do not render client navbar on admin or login pages
  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/login'))) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-primary/40 shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/logo-icon.jpg"
                alt="Logo KHAYROX"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-orbitron text-2xl font-black bg-gradient-to-r from-white via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,212,255,0.6)] tracking-widest transition-all duration-300 group-hover:drop-shadow-[0_0_25px_rgba(0,212,255,0.9)]">
              KHAYROX
            </span>
          </Link>

          <div className="hidden md:flex gap-4 text-sm font-medium">
            <Link
              href="/catalogo"
              className={`px-3 py-1 rounded-md border font-orbitron text-xs font-bold uppercase tracking-wider transition-all duration-300 ${isCatalogActive
                ? 'text-primary bg-primary/10 border-primary/30 shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                : 'text-foreground/80 border-transparent hover:text-primary hover:bg-primary/5'
                }`}
            >
              Catálogo
            </Link>

          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/cotizador" className="relative p-2 text-foreground/80 hover:text-primary transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {mounted && getTotalItems() > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-[#050914]">
                {getTotalItems()}
              </span>
            )}
          </Link>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-primary/20 bg-surface/95 backdrop-blur px-4 py-4 space-y-3">
          <Link
            href="/catalogo"
            className={`block font-orbitron text-xs font-bold uppercase tracking-wider py-2 px-3 rounded-lg border transition-all ${isCatalogActive
              ? 'text-primary bg-primary/10 border-primary/30'
              : 'text-foreground hover:text-primary border-transparent'
              }`}
            onClick={() => setIsOpen(false)}
          >
            Catálogo Completo
          </Link>
        </div>
      )}
    </nav>
  );
}
