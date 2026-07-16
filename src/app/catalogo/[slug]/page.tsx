"use client";

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { mockProducts, Product } from '@/lib/data';
import { useCartStore } from '@/store/cartStore';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const supabase = createClient();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('59100000000');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
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
        console.error('Error fetching whatsapp number:', err);
      }
    };
    fetchWhatsAppNumber();
  }, [supabase]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            id, title, slug, description_short, description_long, base_price, min_order_quantity, estimated_delivery_time, is_available,
            product_images ( url, is_primary ),
            product_categories ( categories ( name, slug ) ),
            product_techniques ( techniques ( slug, name ) ),
            product_tags ( tag )
          `)
          .eq('slug', resolvedParams.slug)
          .eq('is_published', true)
          .single();

        if (error || !data) {
          const mock = mockProducts.find(p => p.slug === resolvedParams.slug);
          if (mock) {
            setProduct(mock);
            setQuantity(mock.min_order_quantity);
          }
        } else {
          const p = data as any;
          const formatted: Product = {
            id: p.id,
            title: p.title,
            slug: p.slug,
            description_short: p.description_short,
            description_long: p.description_long,
            base_price: p.base_price,
            min_order_quantity: p.min_order_quantity || 1,
            estimated_delivery_time: p.estimated_delivery_time || 'Variable',
            category: p.product_categories?.[0]?.categories?.name || '',
            techniques: p.product_techniques?.map((pt: any) => pt.techniques?.name || pt.techniques?.slug) || [],
            images: p.product_images || [],
            tags: p.product_tags?.map((t: any) => t.tag) || [],
            variants: [],
            is_available: p.is_available
          };
          setProduct(formatted);
          setQuantity(formatted.min_order_quantity);
        }
      } catch (err) {
        console.error("Error fetching product detail:", err);
        const mock = mockProducts.find(p => p.slug === resolvedParams.slug);
        if (mock) {
          setProduct(mock);
          setQuantity(mock.min_order_quantity);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.slug, supabase]);

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      const primaryIdx = product.images.findIndex(img => img.is_primary);
      if (primaryIdx !== -1) {
        setActiveImageIndex(primaryIdx);
      } else {
        setActiveImageIndex(0);
      }
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted text-sm font-orbitron">Cargando detalles del producto...</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const isAvailable = product.is_available !== false;

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-primary/20 bg-surface">
            <Image
              src={product.images[activeImageIndex]?.url || product.images[0]?.url || ''}
              alt={product.title}
              fill
              className={`object-cover transition-all duration-300 ${!isAvailable ? 'opacity-60 grayscale-[30%]' : ''}`}
              priority
            />
            {!isAvailable && (
              <div className="absolute top-4 right-4 bg-red-500/90 text-[#050914] text-xs font-orbitron font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.4)] z-10 animate-pulse">
                Agotado
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-square w-full overflow-hidden rounded-xl border bg-surface transition-all duration-200 cursor-pointer ${
                    activeImageIndex === idx 
                      ? 'border-primary shadow-[0_0_12px_rgba(0,212,255,0.35)] scale-95' 
                      : 'border-primary/10 opacity-70 hover:opacity-100 hover:border-primary/30'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`${product.title} vista ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
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
                      disabled={!isAvailable}
                      onClick={() => setSelectedVariants({ ...selectedVariants, [variant.name]: value })}
                      className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                        selectedVariants[variant.name] === value 
                          ? 'border-primary bg-primary/20 text-primary font-bold shadow-[0_0_10px_rgba(0,212,255,0.3)]' 
                          : 'border-primary/20 bg-surface text-muted hover:border-primary/50 disabled:opacity-40'
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
                    disabled={!isAvailable}
                    className="px-4 py-2 text-primary hover:bg-primary/10 transition-colors disabled:opacity-45"
                    onClick={() => setQuantity(Math.max(product.min_order_quantity, quantity - 1))}
                  >
                    -
                  </button>
                  <span className={`w-12 text-center font-bold ${isAvailable ? 'text-foreground' : 'text-muted'}`}>{quantity}</span>
                  <button 
                    disabled={!isAvailable}
                    className="px-4 py-2 text-primary hover:bg-primary/10 transition-colors disabled:opacity-45"
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
                disabled={!isAvailable}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isAvailable ? "Ej. Quiero mi logo en la parte delantera centrado..." : "Producto temporalmente no disponible."}
                className="w-full bg-surface border border-primary/20 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-muted min-h-[100px] resize-none disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className={`w-full h-14 font-bold uppercase tracking-wider rounded-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                  isAvailable
                    ? 'bg-primary text-[#050914] shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] cursor-pointer'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20 cursor-not-allowed shadow-none hover:shadow-none'
                }`}
              >
                {isAvailable ? 'Agregar a la Cotización' : 'Agotado / No Disponible'}
              </button>

              {!isAvailable && (
                <a 
                  href={`https://wa.me/${whatsAppNumber}?text=Hola,%20me%20gustaría%20saber%20si%20puedo%20hacer%20un%20pedido%20especial%20del%20producto%20agotado:%20${encodeURIComponent(product.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-14 border border-primary/20 bg-primary/5 text-primary font-bold uppercase tracking-wider rounded-lg transition-all hover:bg-primary/10 flex items-center justify-center gap-2"
                >
                  Encargar bajo pedido
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
