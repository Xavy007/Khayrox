"use client";

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { createClient } from '@/lib/supabase/client';
import { Product } from '@/lib/data'; // Usaremos esta interface como base
import { Loader2 } from 'lucide-react';

export default function CatalogoPage() {
  const supabase = createClient();
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [techniques, setTechniques] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalogData = async () => {
      setLoading(true);
      
      // Fetch categories & techniques
      const [catsRes, techsRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('techniques').select('*').order('name')
      ]);
      
      if (catsRes.data) setCategories(catsRes.data);
      if (techsRes.data) setTechniques(techsRes.data);

      // Fetch products with their relationships
      const { data: prodsData, error } = await supabase.from('products').select(`
        id, title, slug, description_short, description_long, base_price, min_order_quantity, estimated_delivery_time,
        product_images ( url, is_primary ),
        product_categories ( categories ( slug ) ),
        product_techniques ( techniques ( slug, name ) ),
        product_tags ( tag )
      `).eq('is_published', true);

      if (prodsData) {
        // Mapear los datos de Supabase a la interfaz de ProductCard
        const formattedProducts: Product[] = prodsData.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          description_short: p.description_short,
          description_long: p.description_long,
          base_price: p.base_price,
          min_order_quantity: p.min_order_quantity,
          estimated_delivery_time: p.estimated_delivery_time || 'Variable',
          category: p.product_categories?.[0]?.categories?.slug || '',
          techniques: p.product_techniques?.map((pt: any) => pt.techniques?.slug) || [],
          images: p.product_images || [],
          tags: p.product_tags?.map((t: any) => t.tag) || [],
          variants: [] // Las variantes las cargaremos en la ficha del producto si es necesario
        }));
        setProducts(formattedProducts);
      }
      
      setLoading(false);
    };

    fetchCatalogData();
  }, [supabase]);

  const filteredProducts = products.filter(product => {
    const matchesTechnique = selectedTechnique ? product.techniques.includes(selectedTechnique) : true;
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesTechnique && matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 space-y-8">
        <div>
          <h2 className="font-orbitron text-xl font-bold mb-4 text-foreground border-b border-primary/20 pb-2">Buscar</h2>
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-primary/20 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-muted"
          />
        </div>

        <div>
          <h2 className="font-orbitron text-xl font-bold mb-4 text-foreground border-b border-primary/20 pb-2">Técnicas</h2>
          <div className="flex flex-col gap-2">
            <button 
              className={`text-left px-2 py-1 rounded transition-colors ${selectedTechnique === null ? 'bg-primary/10 text-primary font-bold' : 'text-muted hover:text-foreground'}`}
              onClick={() => setSelectedTechnique(null)}
            >
              Todas
            </button>
            {techniques.map(tech => (
              <button 
                key={tech.id}
                className={`text-left px-2 py-1 rounded transition-colors ${selectedTechnique === tech.slug ? 'bg-primary/10 text-primary font-bold' : 'text-muted hover:text-foreground'}`}
                onClick={() => setSelectedTechnique(tech.slug)}
              >
                {tech.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-orbitron text-xl font-bold mb-4 text-foreground border-b border-primary/20 pb-2">Categorías</h2>
          <div className="flex flex-col gap-2">
            <button 
              className={`text-left px-2 py-1 rounded transition-colors ${selectedCategory === null ? 'bg-primary/10 text-primary font-bold' : 'text-muted hover:text-foreground'}`}
              onClick={() => setSelectedCategory(null)}
            >
              Todas
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                className={`text-left px-2 py-1 rounded transition-colors ${selectedCategory === cat.slug ? 'bg-primary/10 text-primary font-bold' : 'text-muted hover:text-foreground'}`}
                onClick={() => setSelectedCategory(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <main className="flex-1">
        <div className="flex justify-between items-end mb-6">
          <h1 className="text-3xl font-orbitron font-bold text-foreground">Catálogo de Productos</h1>
          {!loading && <span className="text-muted text-sm">{filteredProducts.length} resultados</span>}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
             <p className="text-muted">Cargando catálogo...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-primary/20 rounded-xl bg-surface/50">
            <h3 className="text-xl font-bold text-foreground mb-2">No se encontraron productos</h3>
            <p className="text-muted">Intenta ajustar los filtros de búsqueda.</p>
            <button 
              onClick={() => { setSelectedCategory(null); setSelectedTechnique(null); setSearchQuery(''); }}
              className="mt-4 text-primary hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
