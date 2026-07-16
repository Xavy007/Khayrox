import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/data';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/catalogo/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-xl border border-primary/10 bg-surface transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.2)]">
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-background">
          <Image
            src={product.images.find(img => img.is_primary)?.url || product.images[0]?.url || ''}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-2">
          <div className="flex gap-2 flex-wrap">
            {product.techniques.map(tech => (
              <span key={tech} className="text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/5 px-2 py-1 rounded">
                {tech}
              </span>
            ))}
          </div>
          
          <h3 className="font-orbitron text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          
          <p className="text-sm text-muted line-clamp-2 min-h-[40px]">
            {product.description_short}
          </p>
          
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xl font-bold text-foreground">
              <span className="text-sm font-normal text-muted mr-1">desde</span>
              Bs. {product.base_price}
            </span>
            <span className="text-primary text-sm font-medium hover:underline">
              Ver detalles &rarr;
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
