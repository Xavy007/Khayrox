"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Package, LayoutDashboard, Settings, LogOut, Sparkles, List, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Productos', href: '/admin/productos', icon: Package },
    { name: 'Categorías', href: '/admin/categorias', icon: List },
    { name: 'Configuración', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile Drawer (Menu deslizante) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-[#050914]/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Drawer content */}
          <aside className="relative flex w-64 max-w-xs flex-col bg-surface border-r border-primary/20 p-6 shadow-2xl h-full animate-[slideIn_0.2s_ease-out]">
            <div className="flex items-center justify-between pb-6 border-b border-primary/20">
              <span className="font-orbitron text-xl font-bold text-primary drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]">
                ADMIN PANEL
              </span>
              <button 
                className="p-2 text-muted hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 py-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/20 text-primary font-bold border border-primary/30 shadow-[0_0_15px_rgba(0,212,255,0.1)]' 
                        : 'text-muted hover:text-foreground hover:bg-primary/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-primary/20 pt-4">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Salir
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Sidebar - Desktop only */}
      <aside className="w-64 border-r border-primary/20 bg-surface/50 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-primary/20">
          <span className="font-orbitron text-xl font-bold text-primary drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]">
            ADMIN PANEL
          </span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary/20 text-primary font-bold border border-primary/30 shadow-[0_0_15px_rgba(0,212,255,0.1)]' 
                    : 'text-muted hover:text-foreground hover:bg-primary/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-primary/20">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors">
            <LogOut className="w-5 h-5" />
            Salir
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 flex items-center px-6 border-b border-primary/20 bg-surface/50">
          <button 
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors -ml-2 mr-3"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <h2 className="font-orbitron font-bold text-foreground md:hidden">ADMIN</h2>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary">IA Activada</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center font-bold text-primary">
              K
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
