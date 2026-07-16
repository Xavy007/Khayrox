"use client";

import { Save } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-3xl font-orbitron font-bold text-foreground">Configuración</h1>
      
      <div className="bg-surface border border-primary/20 rounded-xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Información de la Empresa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Nombre del Negocio</label>
              <input 
                type="text"
                defaultValue="KHAYROX"
                className="w-full bg-background border border-primary/20 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Número de WhatsApp (Cotizaciones)</label>
              <input 
                type="text"
                defaultValue="59100000000"
                className="w-full bg-background border border-primary/20 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-primary/10">
          <h2 className="text-xl font-bold text-foreground mb-4">Integraciones</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">URL del Proyecto Supabase</label>
              <input 
                type="text"
                defaultValue={process.env.NEXT_PUBLIC_SUPABASE_URL || ''}
                readOnly
                className="w-full bg-background/50 border border-primary/10 rounded-lg px-4 py-2 text-muted cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-primary/10">
          <button className="flex items-center gap-2 bg-primary text-[#050914] px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(0,212,255,0.4)]">
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
