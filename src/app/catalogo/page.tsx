"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { createClient } from '@/lib/supabase/client';
import { Product, mockProducts, categories as mockCategories, techniques as mockTechniques } from '@/lib/data';
import { Loader2 } from 'lucide-react';

function CatalogoContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [techniques, setTechniques] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state with search params
  useEffect(() => {
    setSelectedTechnique(searchParams.get('technique'));
    setSelectedCategory(searchParams.get('category'));
  }, [searchParams]);

  useEffect(() => {
    const fetchCatalogData = async () => {
      setLoading(true);
      
      try {
        // Fetch categories & techniques from Supabase
        const [catsRes, techsRes] = await Promise.all([
          supabase.from('categories').select('*').order('name'),
          supabase.from('techniques').select('*').order('name')
        ]);
        
        const dbCategories = catsRes.data && catsRes.data.length > 0 ? catsRes.data : mockCategories;
        const dbTechniques = techsRes.data && techsRes.data.length > 0 ? techsRes.data : mockTechniques;
        
        setCategories(dbCategories);
        setTechniques(dbTechniques);

        // Fetch products with their relationships
        const { data: prodsData, error } = await supabase.from('products').select(`
          id, title, slug, description_short, description_long, base_price, min_order_quantity, estimated_delivery_time, is_available,
          product_images ( url, is_primary ),
          product_categories ( categories ( slug ) ),
          product_techniques ( techniques ( slug, name ) ),
          product_tags ( tag )
        `).eq('is_published', true);

        if (error) {
          console.error('Error fetching products from Supabase:', error);
          setProducts(mockProducts);
        } else {
          const formattedProducts: Product[] = (prodsData || []).map((p: any) => ({
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
            variants: [],
            is_available: p.is_available
          }));
          setProducts(formattedProducts);
        }
      } catch (err) {
        console.error('Catch block error fetching catalog:', err);
        setCategories(mockCategories);
        setTechniques(mockTechniques);
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
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
    <div className="container mx-auto px-4 py-6 md:py-12 max-w-7xl flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters - Desktop only */}
      <aside className="hidden md:block w-64 shrink-0 space-y-8">
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

      {/* Product Grid and Mobile Filters */}
      <main className="flex-1 flex flex-col">
        {/* Header Title */}
        <div className="flex justify-between items-end mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-orbitron font-bold text-foreground">Catálogo</h1>
          {!loading && <span className="text-muted text-sm">{filteredProducts.length} resultados</span>}
        </div>

        {/* Mobile Filters Header (Visible only on Mobile) */}
        <div className="md:hidden flex flex-col gap-3 mb-6">
          {/* Mobile Search */}
          <div>
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-primary/20 rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-muted text-sm"
            />
          </div>
          
          {/* Mobile Categories Scroll */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted font-orbitron">Categorías</span>
            <div 
              className="flex gap-2 overflow-x-auto pb-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <button 
                className={`shrink-0 px-3 py-1 text-xs rounded-full border transition-all ${selectedCategory === null ? 'bg-primary/20 border-primary text-primary font-bold' : 'bg-surface border-primary/10 text-muted'}`}
                onClick={() => setSelectedCategory(null)}
              >
                Todas
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  className={`shrink-0 px-3 py-1 text-xs rounded-full border transition-all ${selectedCategory === cat.slug ? 'bg-primary/20 border-primary text-primary font-bold' : 'bg-surface border-primary/10 text-muted'}`}
                  onClick={() => setSelectedCategory(cat.slug)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Techniques Scroll */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted font-orbitron">Técnicas</span>
            <div 
              className="flex gap-2 overflow-x-auto pb-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <button 
                className={`shrink-0 px-3 py-1 text-xs rounded-full border transition-all ${selectedTechnique === null ? 'bg-primary/20 border-primary text-primary font-bold' : 'bg-surface border-primary/10 text-muted'}`}
                onClick={() => setSelectedTechnique(null)}
              >
                Todas
              </button>
              {techniques.map(tech => (
                <button 
                  key={tech.id}
                  className={`shrink-0 px-3 py-1 text-xs rounded-full border transition-all ${selectedTechnique === tech.slug ? 'bg-primary/20 border-primary text-primary font-bold' : 'bg-surface border-primary/10 text-muted'}`}
                  onClick={() => setSelectedTechnique(tech.slug)}
                >
                  {tech.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center flex-1">
             <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
             <p className="text-muted">Cargando catálogo...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-primary/20 rounded-xl bg-surface/50">
            <h3 className="text-xl font-bold text-foreground mb-2">No se encontraron productos</h3>
            <p className="text-muted text-sm">Intenta ajustar los filtros de búsqueda.</p>
            <button 
              onClick={() => { setSelectedCategory(null); setSelectedTechnique(null); setSearchQuery(''); }}
              className="mt-4 text-primary hover:underline text-sm"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 text-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted">Cargando catálogo...</p>
      </div>
    }>
      <CatalogoContent />
    </Suspense>
  );
}
