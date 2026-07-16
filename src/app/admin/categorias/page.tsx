"use client";

import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminCategoriasPage() {
  const supabase = createClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');

  // Auto-generar slug basado en el nombre (solo si no se está editando o si el usuario quiere)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewName(val);
    setNewSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) {
      console.error('Error fetching categories', error);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (!newName || !newSlug) return;
    
    if (editingCategory) {
      // Update existing category
      const { error } = await supabase
        .from('categories')
        .update({ name: newName, slug: newSlug })
        .eq('id', editingCategory.id);

      if (error) {
        alert("Error al actualizar categoría: " + error.message);
      } else {
        alert("Categoría actualizada correctamente.");
        handleCancel();
        fetchCategories();
      }
    } else {
      // Insert new category
      const { error } = await supabase.from('categories').insert([
        { name: newName, slug: newSlug }
      ]);

      if (error) {
        alert("Error al guardar categoría: " + error.message);
      } else {
        handleCancel();
        fetchCategories();
      }
    }
  };

  const handleStartEdit = (cat: Category) => {
    setEditingCategory(cat);
    setNewName(cat.name);
    setNewSlug(cat.slug);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setNewName('');
    setNewSlug('');
    setEditingCategory(null);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta categoría?")) return;
    
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      alert("Error al eliminar: " + error.message);
    } else {
      fetchCategories();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-orbitron font-bold text-foreground">Categorías</h1>
        <button 
          onClick={() => {
            if (isAdding) handleCancel();
            else setIsAdding(true);
          }}
          className="flex items-center gap-2 bg-primary text-[#050914] px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(0,212,255,0.4)]"
        >
          {isAdding && editingCategory ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {isAdding && editingCategory ? 'Cancelar Edición' : 'Nueva Categoría'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-surface border border-primary/20 p-6 rounded-xl shadow-sm mb-6 flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-bold text-foreground mb-2">
              {editingCategory ? 'Editar Nombre de Categoría' : 'Nombre de la Categoría'}
            </label>
            <input 
              type="text"
              value={newName}
              onChange={handleNameChange}
              placeholder="Ej: Gorras"
              className="w-full bg-background border border-primary/20 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-bold text-foreground mb-2">Slug (URL amigable)</label>
            <input 
              type="text"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="ej-gorras"
              className="w-full bg-background border border-primary/20 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleSave}
              className="h-[42px] px-6 bg-primary text-[#050914] font-bold rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
            >
              {editingCategory ? 'Actualizar' : 'Guardar'}
            </button>
            <button 
              onClick={handleCancel}
              className="h-[42px] px-4 bg-surface border border-primary/20 text-muted font-bold rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="bg-surface border border-primary/20 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-primary/20 bg-primary/5 text-muted">
                <th className="p-4 font-medium">Nombre</th>
                <th className="p-4 font-medium">Slug</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-muted">Cargando categorías...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-muted">No hay categorías. ¡Crea una!</td>
                </tr>
              ) : categories.map(cat => (
                <tr key={cat.id} className="border-b border-primary/10 hover:bg-primary/5 transition-colors">
                  <td className="p-4 text-foreground font-medium">{cat.name}</td>
                  <td className="p-4 text-muted">{cat.slug}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleStartEdit(cat)}
                        className="p-2 text-primary hover:bg-primary/10 rounded transition-colors" 
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)}
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
        </div>
      </div>
    </div>
  );
}
