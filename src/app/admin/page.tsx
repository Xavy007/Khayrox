"use client";

import { mockProducts } from '@/lib/data';
import Link from 'next/link';
import { Package, TrendingUp, Users, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboard() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalQuotes: 0,
    catalogViews: 340, // placeholder since there is no analytics tracking yet
  });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Get total products count
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // 2. Get total quotes count
        const { count: quotesCount } = await supabase
          .from('quotes')
          .select('*', { count: 'exact', head: true });

        // 3. Get recent products
        const { data: recentData } = await supabase
          .from('products')
          .select('id, title, base_price, is_published, is_available')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          totalProducts: productsCount !== null ? productsCount : mockProducts.length,
          totalQuotes: quotesCount !== null ? quotesCount : 12,
          catalogViews: 340
        });

        if (recentData && recentData.length > 0) {
          setRecentProducts(recentData);
        } else {
          // Fallback to mock products
          setRecentProducts(mockProducts.slice(0, 3).map(p => ({
            id: p.id,
            title: p.title,
            base_price: p.base_price,
            is_published: true,
            is_available: true
          })));
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-orbitron font-bold text-foreground">Panel de Control</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-primary/20 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-muted font-medium">Total Productos</h3>
            <div className="p-2 bg-primary/10 rounded-lg"><Package className="w-5 h-5 text-primary" /></div>
          </div>
          <p className="text-4xl font-bold text-foreground">
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-primary inline" /> : stats.totalProducts}
          </p>
        </div>
        
        <div className="bg-surface border border-primary/20 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-muted font-medium">Cotizaciones Recibidas</h3>
            <div className="p-2 bg-primary/10 rounded-lg"><TrendingUp className="w-5 h-5 text-primary" /></div>
          </div>
          <p className="text-4xl font-bold text-foreground">
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-primary inline" /> : stats.totalQuotes}
          </p>
        </div>
        
        <div className="bg-surface border border-primary/20 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-muted font-medium">Vistas del Catálogo</h3>
            <div className="p-2 bg-primary/10 rounded-lg"><Users className="w-5 h-5 text-primary" /></div>
          </div>
          <p className="text-4xl font-bold text-foreground">{stats.catalogViews}</p>
        </div>
      </div>

      <div className="mt-8 bg-surface border border-primary/20 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-foreground">Productos Recientes</h2>
          <Link href="/admin/productos" className="text-primary text-sm hover:underline">Ver todos</Link>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="p-8 text-center text-muted">No hay productos en el catálogo.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-primary/10 text-muted">
                  <th className="pb-3 font-medium">Producto</th>
                  <th className="pb-3 font-medium">Precio Base</th>
                  <th className="pb-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map(product => (
                  <tr key={product.id} className="border-b border-primary/10 last:border-0 hover:bg-primary/5 transition-colors">
                    <td className="py-4 text-foreground font-medium">{product.title}</td>
                    <td className="py-4 text-muted">Bs. {product.base_price}</td>
                    <td className="py-4 flex gap-2 items-center">
                      <span className={`px-2 py-0.5 text-[9px] font-orbitron font-bold uppercase rounded border ${
                        product.is_published !== false
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {product.is_published !== false ? 'Publicado' : 'Borrador'}
                      </span>
                      <span className={`px-2 py-0.5 text-[9px] font-orbitron font-bold uppercase rounded border ${
                        product.is_available !== false
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {product.is_available !== false ? 'Disponible' : 'Agotado'}
                      </span>
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
