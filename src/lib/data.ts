export type Technique = {
  id: string;
  name: string;
  slug: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  description_short: string;
  description_long: string;
  base_price: number;
  min_order_quantity: number;
  estimated_delivery_time: string;
  techniques: string[]; // slugs of techniques
  category: string; // slug of category
  images: { url: string; is_primary: boolean }[];
  variants: { name: string; values: string[] }[];
  tags: string[];
  is_available?: boolean;
};

export const techniques: Technique[] = [
  { id: 't1', name: 'Sublimación', slug: 'sublimacion' },
  { id: 't2', name: 'Serigrafía', slug: 'serigrafia' },
  { id: 't3', name: 'Corte y Grabado Láser', slug: 'laser' },
];

export const categories: Category[] = [
  { id: 'c1', name: 'Poleras / Camisetas', slug: 'poleras' },
  { id: 'c2', name: 'Vasos y Tazas', slug: 'tazas' },
  { id: 'c3', name: 'Termos', slug: 'termos' },
  { id: 'c4', name: 'Decoración en Madera', slug: 'madera' },
];

export const mockProducts: Product[] = [
  {
    id: 'p1',
    title: 'Polera Premium Neón',
    slug: 'polera-premium-neon',
    description_short: 'Polera de algodón peinado con estampado de alta densidad.',
    description_long: 'Nuestra polera premium ofrece la máxima comodidad con un corte moderno. El estampado en serigrafía utiliza tintas especiales para lograr un efecto neón brillante que destaca en la oscuridad.',
    base_price: 85,
    min_order_quantity: 1,
    estimated_delivery_time: '3-5 días hábiles',
    techniques: ['serigrafia'],
    category: 'poleras',
    images: [
      { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800', is_primary: true },
    ],
    variants: [
      { name: 'Talla', values: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', values: ['Negro', 'Azul Marino'] }
    ],
    tags: ['ropa', 'premium', 'neón']
  },
  {
    id: 'p2',
    title: 'Termo Metálico KHAYROX',
    slug: 'termo-metalico-khayrox',
    description_short: 'Termo de acero inoxidable con grabado láser de precisión.',
    description_long: 'Mantiene tus bebidas frías por 24h y calientes por 12h. El grabado láser asegura que tu logo o diseño nunca se borre, brindando un acabado elegante y profesional.',
    base_price: 120,
    min_order_quantity: 1,
    estimated_delivery_time: '2-4 días hábiles',
    techniques: ['laser', 'sublimacion'],
    category: 'termos',
    images: [
      { url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800', is_primary: true },
    ],
    variants: [
      { name: 'Color', values: ['Plata', 'Negro Mate'] }
    ],
    tags: ['oficina', 'regalo', 'premium']
  },
  {
    id: 'p3',
    title: 'Taza Mágica Sublimada',
    slug: 'taza-magica-sublimada',
    description_short: 'Taza negra que revela el diseño al contacto con líquidos calientes.',
    description_long: 'Sorprende a todos con esta taza que cambia de color. Impresión full color en calidad fotográfica que aparece como por arte de magia al verter café o té.',
    base_price: 45,
    min_order_quantity: 1,
    estimated_delivery_time: '1-3 días hábiles',
    techniques: ['sublimacion'],
    category: 'tazas',
    images: [
      { url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800', is_primary: true },
    ],
    variants: [],
    tags: ['regalo', 'magia', 'tazas']
  },
  {
    id: 'p4',
    title: 'Letrero Acrílico Iluminado',
    slug: 'letrero-acrilico-iluminado',
    description_short: 'Letrero cortado a láser con bordes pulidos y base LED.',
    description_long: 'Ideal para decorar tu escritorio o habitación. El acrílico transparente grabado refleja la luz LED de la base creando un efecto holográfico espectacular, perfecto para estética gamer o cyberpunk.',
    base_price: 180,
    min_order_quantity: 1,
    estimated_delivery_time: '4-7 días hábiles',
    techniques: ['laser'],
    category: 'madera',
    images: [
      { url: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&q=80&w=800', is_primary: true },
    ],
    variants: [
      { name: 'Color LED', values: ['Cian Neón', 'Azul Profundo', 'Multicolor'] },
      { name: 'Tamaño', values: ['Pequeño (15cm)', 'Mediano (25cm)'] }
    ],
    tags: ['gamer', 'decoración', 'neón']
  }
];
