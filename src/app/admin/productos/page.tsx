"use client";

import { useState, useEffect } from 'react';
import { mockProducts, Product } from '@/lib/data';
import Link from 'next/link';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminProductsPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data: prodsData, error } = await supabase.from('products').select(`
        id, title, slug, description_short, description_long, base_price, min_order_quantity, estimated_delivery_time, is_available,
        product_images ( url, is_primary ),
        product_categories ( categories ( name, slug ) ),
        product_techniques ( techniques ( slug, name ) ),
        product_tags ( tag )
      `).order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products from Supabase:', error);
        setProducts(mockProducts);
        setIsUsingMock(true);
      } else if (prodsData && prodsData.length > 0) {
        const formattedProducts: Product[] = prodsData.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          description_short: p.description_short,
          description_long: p.description_long,
          base_price: p.base_price,
          min_order_quantity: p.min_order_quantity,
          estimated_delivery_time: p.estimated_delivery_time || 'Variable',
          category: p.product_categories?.[0]?.categories?.name || 'Sin categoría',
          techniques: p.product_techniques?.map((pt: any) => pt.techniques?.name) || [],
          images: p.product_images || [],
          tags: p.product_tags?.map((t: any) => t.tag) || [],
          variants: [],
          is_available: p.is_available
        }));
        setProducts(formattedProducts);
        setIsUsingMock(false);
      } else {
        console.log('No products found in Supabase or query empty, falling back to mockProducts');
        setProducts(mockProducts);
        setIsUsingMock(true);
      }
    } catch (err) {
      console.error('Catch block error fetching products:', err);
      setProducts(mockProducts);
      setIsUsingMock(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    if (isUsingMock) {
      setProducts(products.filter(p => p.id !== id));
      alert("Producto eliminado (Simulación local).");
    } else {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        alert("Error al eliminar: " + error.message);
      } else {
        alert("Producto eliminado exitosamente.");
        fetchProducts();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-orbitron font-bold text-foreground">Productos</h1>
        <Link 
          href="/admin/productos/nuevo" 
          className="flex items-center gap-2 bg-primary text-[#050914] px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(0,212,255,0.4)]"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </Link>
      </div>

      <div className="bg-surface border border-primary/20 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
              <p className="text-muted text-sm">Cargando productos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-muted">No hay productos en el catálogo. ¡Agrega uno nuevo!</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-primary/20 bg-primary/5 text-muted">
                  <th className="p-4 font-medium">Producto</th>
                  <th className="p-4 font-medium">Categoría</th>
                  <th className="p-4 font-medium">Precio Base</th>
                  <th className="p-4 font-medium">Estado</th>
                  <th className="p-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-primary/10 hover:bg-primary/5 transition-colors">
                    <td className="p-4 text-foreground font-medium flex items-center gap-3">
                      <img 
                        src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=80' } 
                        alt={product.title} 
                        className="w-10 h-10 rounded object-cover border border-primary/20" 
                      />
                      {product.title}
                    </td>
                    <td className="p-4 text-muted capitalize">{product.category}</td>
                    <td className="p-4 text-muted">Bs. {product.base_price}</td>
                    <td className="p-4">
                      {product.is_available !== false ? (
                        <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20 font-bold uppercase tracking-wider text-[10px]">
                          Disponible
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-full border border-red-500/20 font-bold uppercase tracking-wider text-[10px]">
                          Agotado
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/admin/productos/${product.id}`}
                          className="p-2 text-primary hover:bg-primary/10 rounded transition-colors block" 
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors" 
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
