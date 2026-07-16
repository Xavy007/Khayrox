"use client";

import { mockProducts } from '@/lib/data';
import Link from 'next/link';
import { Package, TrendingUp, Users } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-orbitron font-bold text-foreground">Panel de Control</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-primary/20 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-muted font-medium">Total Productos</h3>
            <div className="p-2 bg-primary/10 rounded-lg"><Package className="w-5 h-5 text-primary" /></div>
          </div>
          <p className="text-4xl font-bold text-foreground">{mockProducts.length}</p>
        </div>
        
        <div className="bg-surface border border-primary/20 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-muted font-medium">Cotizaciones Hoy</h3>
            <div className="p-2 bg-primary/10 rounded-lg"><TrendingUp className="w-5 h-5 text-primary" /></div>
          </div>
          <p className="text-4xl font-bold text-foreground">12</p>
        </div>
        
        <div className="bg-surface border border-primary/20 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-muted font-medium">Vistas del Catálogo</h3>
            <div className="p-2 bg-primary/10 rounded-lg"><Users className="w-5 h-5 text-primary" /></div>
          </div>
          <p className="text-4xl font-bold text-foreground">340</p>
        </div>
      </div>

      <div className="mt-8 bg-surface border border-primary/20 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-foreground">Productos Recientes</h2>
          <Link href="/admin/productos" className="text-primary text-sm hover:underline">Ver todos</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-primary/10 text-muted">
                <th className="pb-3 font-medium">Producto</th>
                <th className="pb-3 font-medium">Precio Base</th>
                <th className="pb-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {mockProducts.slice(0, 3).map(product => (
                <tr key={product.id} className="border-b border-primary/10 last:border-0">
                  <td className="py-4 text-foreground font-medium">{product.title}</td>
                  <td className="py-4 text-muted">Bs. {product.base_price}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">Publicado</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
