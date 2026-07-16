"use client";

import { mockProducts } from '@/lib/data';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminProductsPage() {
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
              {mockProducts.map(product => (
                <tr key={product.id} className="border-b border-primary/10 hover:bg-primary/5 transition-colors">
                  <td className="p-4 text-foreground font-medium flex items-center gap-3">
                    <img src={product.images[0]?.url} alt={product.title} className="w-10 h-10 rounded object-cover border border-primary/20" />
                    {product.title}
                  </td>
                  <td className="p-4 text-muted capitalize">{product.category}</td>
                  <td className="p-4 text-muted">Bs. {product.base_price}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">Publicado</span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-primary hover:bg-primary/10 rounded transition-colors" title="Editar">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
