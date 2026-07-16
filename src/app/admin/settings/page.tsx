"use client";

import { useState, useEffect } from 'react';
import { Save, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [businessName, setBusinessName] = useState('KHAYROX');
  const [whatsApp, setWhatsApp] = useState('59100000000');
  const [heroBannerUrl, setHeroBannerUrl] = useState('/hero-showcase-flatlay.png');
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('site_config').select('*');
        if (data) {
          const nameSetting = data.find(s => s.key === 'business_name');
          const phoneSetting = data.find(s => s.key === 'whatsapp_number');
          const bannerSetting = data.find(s => s.key === 'hero_banner_url');
          
          if (nameSetting) setBusinessName(nameSetting.value);
          if (phoneSetting) setWhatsApp(phoneSetting.value);
          if (bannerSetting) {
            setHeroBannerUrl(bannerSetting.value);
            setImagePreview(bannerSetting.value);
          } else {
            setImagePreview('/hero-showcase-flatlay.png');
          }
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [supabase]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let finalBannerUrl = heroBannerUrl;

      // 1. Upload new image if selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `hero-banner-${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          throw new Error('Error al subir la imagen del banner: ' + uploadError.message);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
        finalBannerUrl = publicUrl;
      }

      // 2. Save settings to site_config
      const updates = [
        { key: 'business_name', value: businessName },
        { key: 'whatsapp_number', value: whatsApp },
        { key: 'hero_banner_url', value: finalBannerUrl }
      ];

      const { error: upsertError } = await supabase.from('site_config').upsert(updates);
      if (upsertError) {
        throw new Error('Error al guardar la configuración: ' + upsertError.message);
      }

      setHeroBannerUrl(finalBannerUrl);
      alert('¡Configuración guardada exitosamente!');
    } catch (err: any) {
      alert(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-3xl font-orbitron font-bold text-foreground">Configuración</h1>
      
      <div className="bg-surface border border-primary/20 rounded-xl p-6 shadow-sm space-y-6">
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4 font-orbitron border-b border-primary/10 pb-2">Información de la Empresa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Nombre del Negocio</label>
              <input 
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-background border border-primary/20 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Número de WhatsApp (Cotizaciones)</label>
              <input 
                type="text"
                value={whatsApp}
                onChange={(e) => setWhatsApp(e.target.value)}
                className="w-full bg-background border border-primary/20 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Hero Banner Upload section */}
        <div className="pt-4 border-t border-primary/10">
          <h2 className="text-xl font-bold text-foreground mb-4 font-orbitron border-b border-primary/10 pb-2">Imagen de Portada (Landing Page)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left side: Upload control */}
            <div className="space-y-4">
              <p className="text-sm text-muted">Sube una imagen premium para la portada de tu página de inicio. Se recomienda un tamaño horizontal realista (ej. tazas, termos y poleras con tu logo).</p>
              
              <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-primary/20 rounded-xl cursor-pointer bg-background hover:bg-primary/5 hover:border-primary/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-primary mb-2" />
                  <p className="text-sm text-muted"><span className="font-bold text-primary">Haz clic para subir</span> o arrastra</p>
                  <p className="text-xs text-muted/65">PNG, JPG o WEBP (máx. 5MB)</p>
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden" 
                />
              </label>
            </div>
            
            {/* Right side: Preview */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-foreground">Vista Previa del Banner</label>
              {imagePreview ? (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-primary/20 bg-background flex items-center justify-center">
                  <img 
                    src={imagePreview} 
                    alt="Vista previa del banner" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-xl border border-dashed border-primary/10 bg-background flex flex-col items-center justify-center text-muted">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-sm">Sin imagen cargada</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Integrations Section */}
        <div className="pt-4 border-t border-primary/10">
          <h2 className="text-xl font-bold text-foreground mb-4 font-orbitron border-b border-primary/10 pb-2">Integraciones</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">URL del Proyecto Supabase</label>
              <input 
                type="text"
                value={process.env.NEXT_PUBLIC_SUPABASE_URL || ''}
                readOnly
                className="w-full bg-background/50 border border-primary/10 rounded-lg px-4 py-2 text-muted cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4 border-t border-primary/10">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-[#050914] px-6 py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(0,212,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
