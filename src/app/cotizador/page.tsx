"use client";

import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CotizadorPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleWhatsAppQuote = () => {
    const phoneNumber = "59100000000"; // Placeholder para el número
    
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
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
      <h1 className="text-3xl md:text-5xl font-orbitron font-bold text-foreground mb-8">
        Armador de <span className="text-primary drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]">Cotización</span>
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-primary/20 rounded-2xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">Tu cotización está vacía</h2>
          <p className="text-muted mb-8">Explora nuestro catálogo y agrega productos para cotizarlos por WhatsApp.</p>
          <Link href="/catalogo" className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-bold text-[#050914] uppercase tracking-wider transition-all hover:bg-primary/90">
            Ir al Catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
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

          <div className="lg:col-span-1">
            <div className="sticky top-24 border border-primary/30 bg-surface rounded-2xl p-6 shadow-[0_0_30px_rgba(0,212,255,0.05)]">
              <h2 className="text-xl font-bold font-orbitron mb-6 border-b border-primary/20 pb-4">Resumen de Cotización</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted">
                  <span>Productos ({items.length})</span>
                  <span>Calculando...</span>
                </div>
                <div className="flex justify-between font-bold text-xl text-foreground pt-4 border-t border-primary/20">
                  <span>Total Base Ref.</span>
                  <span className="text-primary">Bs. {getTotalPrice()}</span>
                </div>
                <p className="text-xs text-muted/70 text-center mt-2">
                  * Este es un precio base referencial. El costo final dependerá del diseño de personalización enviado.
                </p>
              </div>

              <button 
                onClick={handleWhatsAppQuote}
                className="w-full h-14 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold uppercase tracking-wider rounded-lg shadow-lg transition-all transform active:scale-95"
              >
                Enviar por WhatsApp
              </button>
              
              <Link href="/catalogo" className="w-full block text-center mt-4 text-sm text-primary hover:underline">
                Seguir viendo productos
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
