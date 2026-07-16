"use client";

import { useState, use } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { mockProducts } from '@/lib/data';
import { useCartStore } from '@/store/cartStore';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const product = mockProducts.find(p => p.slug === resolvedParams.slug);
  
  if (!product) {
    notFound();
  }

  const [quantity, setQuantity] = useState(product.min_order_quantity);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');
  
  const addItem = useCartStore(state => state.addItem);

  const handleAddToCart = () => {
    // Validate variants
    const missingVariants = product.variants.filter(v => !selectedVariants[v.name]);
    if (missingVariants.length > 0) {
      alert(`Por favor selecciona: ${missingVariants.map(v => v.name).join(', ')}`);
      return;
    }

    addItem({
      id: crypto.randomUUID(),
      product,
      quantity,
      selectedVariants,
      notes
    });
    
    alert('¡Producto agregado al carrito de cotización!');
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-primary/20 bg-surface">
            <Image
              src={product.images.find(img => img.is_primary)?.url || product.images[0]?.url || ''}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex gap-2 flex-wrap mb-4">
              {product.techniques.map(tech => (
                <span key={tech} className="text-xs font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/5 px-3 py-1 rounded-full">
                  {tech}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-orbitron font-bold text-foreground mb-2">
              {product.title}
            </h1>
            <div className="text-3xl font-bold text-foreground">
              <span className="text-lg font-normal text-muted mr-2">Precio ref. desde</span>
              Bs. {product.base_price}
            </div>
          </div>

          <div className="prose prose-invert border-y border-primary/10 py-6">
            <p className="text-lg text-muted/90">{product.description_short}</p>
            <p className="text-muted mt-4">{product.description_long}</p>
            <div className="mt-4 text-sm text-muted">
              <span className="font-bold text-foreground">Tiempo de entrega estimado:</span> {product.estimated_delivery_time}
            </div>
          </div>

          {/* Variants Selector */}
          <div className="space-y-6">
            {product.variants.map(variant => (
              <div key={variant.name}>
                <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">
                  {variant.name}
                </label>
                <div className="flex flex-wrap gap-2">
                  {variant.values.map(value => (
                    <button
                      key={value}
                      onClick={() => setSelectedVariants({ ...selectedVariants, [variant.name]: value })}
                      className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                        selectedVariants[variant.name] === value 
                          ? 'border-primary bg-primary/20 text-primary font-bold shadow-[0_0_10px_rgba(0,212,255,0.3)]' 
                          : 'border-primary/20 bg-surface text-muted hover:border-primary/50'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">
                Cantidad
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-primary/20 rounded-lg bg-surface">
                  <button 
                    className="px-4 py-2 text-primary hover:bg-primary/10 transition-colors"
                    onClick={() => setQuantity(Math.max(product.min_order_quantity, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-foreground">{quantity}</span>
                  <button 
                    className="px-4 py-2 text-primary hover:bg-primary/10 transition-colors"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-muted">Mínimo: {product.min_order_quantity}</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">
                Notas de Personalización
              </label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Quiero mi logo en la parte delantera centrado..."
                className="w-full bg-surface border border-primary/20 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-muted min-h-[100px] resize-none"
              />
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full h-14 bg-primary text-[#050914] font-bold uppercase tracking-wider rounded-lg shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] transition-all transform active:scale-95"
            >
              Agregar a la Cotización
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
