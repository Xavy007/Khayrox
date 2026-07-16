"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { compressImage } from '@/lib/imageCompressor';

export default function NuevoProductoPage() {
  const supabase = createClient();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [techniques, setTechniques] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [images, setImages] = useState<{ id: string; url: string; isPrimary: boolean; file: File }[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description_short: '',
    description_long: '',
    base_price: '',
    tags: '',
    selectedCategories: [] as string[],
    selectedTechniques: [] as string[],
    is_available: true
  });

  useEffect(() => {
    const fetchData = async () => {
      const [catsRes, techsRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('techniques').select('*').order('name')
      ]);
      if (catsRes.data) setCategories(catsRes.data);
      if (techsRes.data) setTechniques(techsRes.data);
    };
    fetchData();
  }, [supabase]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages: { id: string; url: string; isPrimary: boolean; file: File }[] = [];
      
      for (const file of filesArray) {
        const compressedFile = await compressImage(file);
        const id = Math.random().toString(36).substring(7);
        const url = URL.createObjectURL(compressedFile);
        newImages.push({ id, url, isPrimary: false, file: compressedFile });
      }
      
      setImages(prev => {
        const hasPrimary = prev.some(img => img.isPrimary);
        const adjustedNewImages = newImages.map((img, idx) => ({
          ...img,
          isPrimary: !hasPrimary && idx === 0
        }));
        return [...prev, ...adjustedNewImages];
      });
    }
  };

  const handleSetPrimary = (id: string) => {
    setImages(prev => prev.map(img => ({
      ...img,
      isPrimary: img.id === id
    })));
  };

  const handleRemoveImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      const hasPrimary = filtered.some(img => img.isPrimary);
      if (!hasPrimary && filtered.length > 0) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const handleCategoryToggle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(id)
        ? prev.selectedCategories.filter(c => c !== id)
        : [...prev.selectedCategories, id]
    }));
  };

  const handleTechniqueToggle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTechniques: prev.selectedTechniques.includes(id)
        ? prev.selectedTechniques.filter(t => t !== id)
        : [...prev.selectedTechniques, id]
    }));
  };

  const handleSave = async () => {
    if (!formData.title) {
      alert('El título es obligatorio');
      return;
    }
    
    setIsSaving(true);
    const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    try {
      // 1. Insert Product
      const { data: productData, error: productError } = await supabase.from('products').insert([
        { 
          title: formData.title,
          slug,
          description_short: formData.description_short,
          description_long: formData.description_long,
          base_price: Number(formData.base_price) || 0,
          is_published: true,
          is_available: formData.is_available
        }
      ]).select().single();

      if (productError) throw productError;

      // 2. Upload Images
      if (images.length > 0) {
        for (const img of images) {
          const fileExt = img.file.name.split('.').pop();
          const fileName = `${productData.id}-${Math.random()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, img.file);
            
          if (uploadError) {
            console.error("Error al subir imagen:", uploadError);
          } else {
            // Get public URL and save to product_images
            const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
            await supabase.from('product_images').insert([{
              product_id: productData.id,
              url: publicUrl,
              is_primary: img.isPrimary
            }]);
          }
        }
      }

      // 3. Link Categories
      if (formData.selectedCategories.length > 0) {
        await supabase.from('product_categories').insert(
          formData.selectedCategories.map(catId => ({ product_id: productData.id, category_id: catId }))
        );
      }

      // 4. Link Techniques
      if (formData.selectedTechniques.length > 0) {
        await supabase.from('product_techniques').insert(
          formData.selectedTechniques.map(techId => ({ product_id: productData.id, technique_id: techId }))
        );
      }

      // 5. Save Tags
      const tagList = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);
      if (tagList.length > 0) {
        await supabase.from('product_tags').insert(
          tagList.map(tag => ({ product_id: productData.id, tag }))
        );
      }

      alert('¡Producto guardado exitosamente con sus imágenes!');
      setFormData({ title: '', description_short: '', description_long: '', base_price: '', tags: '', selectedCategories: [], selectedTechniques: [], is_available: true });
      setImages([]);
    } catch (error: any) {
      alert('Error al guardar: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/productos" className="p-2 bg-surface border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors text-muted hover:text-primary">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-orbitron font-bold text-foreground">Crear Producto</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Imagen del Producto */}
        <div className="md:col-span-1 space-y-4">
          <label className="block text-sm font-bold text-foreground">Imágenes del Producto</label>
          
          {/* Main Upload Box */}
          <div 
            className="w-full aspect-video bg-background border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center gap-2 overflow-hidden relative hover:border-primary/60 transition-colors group cursor-pointer"
          >
            <ImageIcon className="w-8 h-8 text-primary/30" />
            <span className="text-xs text-muted font-orbitron font-bold">Agregar fotos</span>
            <input 
              type="file" 
              accept="image/*" 
              multiple
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          
          {/* Previews List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {images.map((img) => (
              <div 
                key={img.id} 
                className={`relative flex items-center gap-3 p-2 bg-surface border rounded-lg transition-all ${
                  img.isPrimary ? 'border-primary/50 shadow-[0_0_10px_rgba(0,212,255,0.15)]' : 'border-primary/10'
                }`}
              >
                <img src={img.url} alt="Preview" className="w-16 h-16 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted truncate">{img.file.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => handleSetPrimary(img.id)}
                      className={`text-[9px] font-orbitron font-bold px-2 py-0.5 rounded transition-all cursor-pointer ${
                        img.isPrimary 
                          ? 'bg-primary text-[#050914] border border-primary/30' 
                          : 'bg-primary/5 text-primary border border-primary/20 hover:bg-primary/20'
                      }`}
                    >
                      {img.isPrimary ? '★ Principal' : 'Hacer Principal'}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveImage(img.id)}
                  className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors cursor-pointer"
                  title="Eliminar foto"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {images.length === 0 && (
              <p className="text-xs text-muted text-center py-4">No hay fotos seleccionadas.</p>
            )}
          </div>
          <p className="text-[10px] text-muted text-center">Se recomienda formato cuadrado (1:1) e imágenes optimizadas.</p>
        </div>

        {/* Datos Principales */}
        <div className="md:col-span-2 space-y-6 bg-surface border border-primary/20 p-6 rounded-xl shadow-sm">
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Nombre del Producto</label>
            <input 
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-background border border-primary/20 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Ej. Polera Cuello V..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Descripción Corta (Tarjeta)</label>
            <input 
              type="text"
              value={formData.description_short}
              onChange={(e) => setFormData({...formData, description_short: e.target.value})}
              className="w-full bg-background border border-primary/20 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Descripción Larga (Ficha)</label>
            <textarea 
              value={formData.description_long}
              onChange={(e) => setFormData({...formData, description_long: e.target.value})}
              rows={4}
              className="w-full bg-background border border-primary/20 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Precio Base Referencial (Bs.)</label>
              <input 
                type="number"
                value={formData.base_price}
                onChange={(e) => setFormData({...formData, base_price: e.target.value})}
                className="w-full bg-background border border-primary/20 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Etiquetas (separadas por coma)</label>
              <input 
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="w-full bg-background border border-primary/20 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col justify-end pb-1.5">
              <label className="flex items-center gap-2.5 cursor-pointer h-10 select-none">
                <input 
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                  className="rounded border-primary/30 text-primary focus:ring-primary bg-background w-5 h-5 cursor-pointer"
                />
                <span className="text-sm font-bold text-foreground">Disponible para Venta</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-primary/10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-foreground mb-3">Categorías</label>
              <div className="space-y-2 max-h-40 overflow-y-auto bg-background/50 p-3 rounded-lg border border-primary/10">
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.selectedCategories.includes(cat.id)}
                      onChange={() => handleCategoryToggle(cat.id)}
                      className="rounded border-primary/30 text-primary focus:ring-primary bg-background"
                    />
                    <span className="text-sm text-foreground/80">{cat.name}</span>
                  </label>
                ))}
                {categories.length === 0 && <p className="text-xs text-muted">No hay categorías.</p>}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-foreground mb-3">Técnicas de Personalización</label>
              <div className="space-y-2 max-h-40 overflow-y-auto bg-background/50 p-3 rounded-lg border border-primary/10">
                {techniques.map(tech => (
                  <label key={tech.id} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.selectedTechniques.includes(tech.id)}
                      onChange={() => handleTechniqueToggle(tech.id)}
                      className="rounded border-primary/30 text-primary focus:ring-primary bg-background"
                    />
                    <span className="text-sm text-foreground/80">{tech.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-8 h-12 bg-primary text-[#050914] font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(0,212,255,0.4)] disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSaving ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
