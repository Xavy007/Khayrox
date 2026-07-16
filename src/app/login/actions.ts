'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // Para simplificar, redirigimos de nuevo al login si hay error
    // En producción se manejaría con estado y mensajes de error
    redirect('/login?error=true')
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}
