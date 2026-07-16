"use client";

import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { Trash2, MessageSquare, Sparkles, HelpCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function CotizadorPage() {
  const supabase = createClient();
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [whatsAppNumber, setWhatsAppNumber] = useState('59100000000');

  // Form states for custom customization query
  const [customName, setCustomName] = useState('');
  const [customService, setCustomService] = useState('Sublimación');
  const [customIdea, setCustomIdea] = useState('');
  const [customQuantity, setCustomQuantity] = useState('10');
  const [customDetails, setCustomDetails] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setMounted(true);
    const fetchWhatsAppNumber = async () => {
      try {
        const { data } = await supabase
          .from('site_config')
          .select('value')
          .eq('key', 'whatsapp_number')
          .single();
        if (data?.value) {
          setWhatsAppNumber(data.value);
        }
      } catch (err) {
        console.error('Error loading WhatsApp configuration:', err);
      }
    };
    fetchWhatsAppNumber();
  }, [supabase]);

  const handleWhatsAppQuote = () => {
    let message = "Hola KHAYROX! Quiero cotizar los siguientes productos:\n\n";
    
    items.forEach((item, index) => {
      message += `${index + 1}. *${item.product.title}* (Cant: ${item.quantity})\n`;
      Object.entries(item.selectedVariants).forEach(([key, value]) => {
        message += `   - ${key}: ${value}\n`;
      });
      if (item.notes) {
        message += `   - Notas: ${item.notes}\n`;
      }
      message += `   - Precio base unitario ref: Bs. ${item.product.base_price}\n\n`;
    });

    message += `*Precio base total estimado:* Bs. ${getTotalPrice()}\n\n`;
    message += "Por favor, confírmenme el costo final de personalización y tiempos de entrega.";

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsAppNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleCustomQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customIdea.trim()) {
      setFormError('Por favor, ingresa tu nombre y describe tu idea.');
      return;
    }
    setFormError('');

    let message = `¡Hola KHAYROX! Tengo una idea especial de personalización y me gustaría hacer una consulta:\n\n`;
    message += `👤 *Nombre:* ${customName}\n`;
    message += `🛠️ *Tipo de Servicio:* ${customService}\n`;
    message += `📦 *Cantidad aproximada:* ${customQuantity} unidades\n`;
    message += `💡 *Descripción de la idea:* ${customIdea}\n`;
    if (customDetails.trim()) {
      message += `📝 *Detalles adicionales:* ${customDetails}\n`;
    }
    message += `\n¿Me podrían indicar si es factible realizar este proyecto, un costo aproximado y los plazos de entrega? ¡Gracias!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsAppNumber}?text=${encodedMessage}`, '_blank');
  };

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
      <h1 className="text-3xl md:text-5xl font-orbitron font-bold text-foreground mb-4">
        Armador de <span className="text-primary drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]">Cotización</span>
      </h1>
      <p className="text-muted mb-10 max-w-2xl text-sm sm:text-base">
        Puedes cotizar los productos seleccionados en el carrito o enviarnos una propuesta personalizada para sublimación, serigrafía o corte láser de proyectos especiales.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle area: Cart items OR Info message */}
        <div className="lg:col-span-2 space-y-8">
          {items.length === 0 ? (
            <div className="p-8 border border-primary/20 bg-surface rounded-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto text-primary">
                <HelpCircle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Tu cotizador está vacío</h2>
                <p className="text-muted max-w-md mx-auto">Explora nuestro catálogo y agrega productos para armar un pedido formal y cotizarlo por WhatsApp.</p>
              </div>
              <Link href="/catalogo" className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-[#050914] uppercase tracking-wider transition-all hover:scale-105 hover:bg-primary/90 shadow-[0_0_15px_rgba(0,212,255,0.3)]">
                Ir al Catálogo de Productos
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-orbitron text-foreground flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                Productos Seleccionados
              </h2>
              {items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-primary/20 bg-surface rounded-xl relative">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground font-orbitron">{item.product.title}</h3>
                    <div className="text-sm text-muted mt-2 space-y-1">
                      {Object.entries(item.selectedVariants).map(([k, v]) => (
                        <p key={k}><span className="font-semibold text-foreground/80">{k}:</span> {v}</p>
                      ))}
                      {item.notes && <p className="italic border-l-2 border-primary/50 pl-2 mt-2">"{item.notes}"</p>}
                    </div>
                  </div>
                  
                  <div className="flex sm:flex-col justify-between items-end gap-4 border-t sm:border-t-0 sm:border-l border-primary/10 pt-4 sm:pt-0 sm:pl-4">
                    <div className="text-right">
                      <p className="text-xs text-muted mb-1">Precio unitario base</p>
                      <p className="font-bold text-foreground">Bs. {item.product.base_price}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-primary/30 rounded bg-background">
                        <button className="px-2 py-1 text-primary hover:bg-primary/10" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button className="px-2 py-1 text-primary hover:bg-primary/10" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      
                      <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300 transition-colors p-1" title="Eliminar">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Form for custom customization inquiry */}
          <div className="border border-primary/20 bg-surface rounded-2xl p-6 md:p-8 space-y-6 shadow-sm relative overflow-hidden">
            {/* Background design accents */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 border border-primary/30 rounded-xl text-primary">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold font-orbitron text-foreground">¿Quieres personalizar algo único?</h2>
                <p className="text-sm text-muted">¿Tienes una idea novedosa para sublimar, estampar o cortar a láser? Cuéntanos tu proyecto especial.</p>
              </div>
            </div>

            <form onSubmit={handleCustomQuoteSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">Tu Nombre / Empresa</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full bg-background border border-primary/20 rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">¿Qué servicio necesitas?</label>
                  <select
                    value={customService}
                    onChange={(e) => setCustomService(e.target.value)}
                    className="w-full bg-background border border-primary/20 rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  >
                    <option value="Sublimación">Sublimación (Tazas, jarros, mousepads, etc.)</option>
                    <option value="Serigrafía">Serigrafía / Estampado (Poleras, sudaderas, gorras)</option>
                    <option value="Corte o Grabado Láser">Corte o Grabado Láser (Acrílicos, madera, termos)</option>
                    <option value="Proyecto Mixto">Proyecto Mixto / Otro especial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">Describe tu idea de personalización</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Ej: Quisiera sublimar 20 tazas mágicas con un diseño de constelaciones y nombres individuales, o cortar láminas de acrílico en forma de estrella de 10cm."
                    value={customIdea}
                    onChange={(e) => setCustomIdea(e.target.value)}
                    className="w-full bg-background border border-primary/20 rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm resize-none"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">Cantidad aproximada</label>
                  <input
                    type="text"
                    placeholder="Ej. 25"
                    value={customQuantity}
                    onChange={(e) => setCustomQuantity(e.target.value)}
                    className="w-full bg-background border border-primary/20 rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">Detalles adicionales (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Requiero acrílico transparente de 3mm de grosor / Necesito entrega urgente en 5 días."
                  value={customDetails}
                  onChange={(e) => setCustomDetails(e.target.value)}
                  className="w-full bg-background border border-primary/20 rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                />
              </div>

              {formError && <p className="text-red-400 text-xs font-semibold">{formError}</p>}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto h-12 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold uppercase tracking-wider px-8 rounded-lg shadow-md transition-all active:scale-95 text-xs sm:text-sm"
                >
                  <MessageSquare className="w-5 h-5" />
                  Enviar Idea Especial por WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right area: Summary of cart quote (only if items are in cart) */}
        <div className="lg:col-span-1">
          {items.length > 0 ? (
            <div className="sticky top-24 border border-primary/30 bg-surface rounded-2xl p-6 shadow-[0_0_30px_rgba(0,212,255,0.05)]">
              <h2 className="text-xl font-bold font-orbitron mb-6 border-b border-primary/20 pb-4">Resumen de Cotización</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted text-sm">
                  <span>Productos ({items.length})</span>
                  <span className="font-bold text-foreground">Bs. {getTotalPrice()}</span>
                </div>
                <div className="flex justify-between font-bold text-xl text-foreground pt-4 border-t border-primary/20">
                  <span>Total Base Ref.</span>
                  <span className="text-primary">Bs. {getTotalPrice()}</span>
                </div>
                <p className="text-[11px] text-muted/70 text-center leading-relaxed">
                  * Este es un precio base referencial. El costo final y los tiempos dependerán de la complejidad del diseño enviado.
                </p>
              </div>

              <button 
                onClick={handleWhatsAppQuote}
                className="w-full h-14 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold uppercase tracking-wider rounded-lg shadow-lg transition-all transform active:scale-95"
              >
                Enviar Carrito por WhatsApp
              </button>
              
              <Link href="/catalogo" className="w-full block text-center mt-4 text-sm text-primary hover:underline">
                Seguir viendo productos
              </Link>
            </div>
          ) : (
            <div className="sticky top-24 border border-primary/10 bg-surface/50 rounded-2xl p-6 space-y-6">
              <h3 className="font-bold font-orbitron text-foreground text-lg border-b border-primary/10 pb-3">Proceso de Cotización</h3>
              <ol className="space-y-4 text-sm text-muted">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs">1</span>
                  <span><strong>Elige tu método:</strong> Arma tu carrito con productos o llena el formulario de diseño a medida.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs">2</span>
                  <span><strong>Detalla tu idea:</strong> Escribe tu propuesta de sublimación, serigrafía o grabado láser.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs">3</span>
                  <span><strong>WhatsApp Directo:</strong> Te atenderemos al instante para darte costos finales y plazos de entrega.</span>
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
