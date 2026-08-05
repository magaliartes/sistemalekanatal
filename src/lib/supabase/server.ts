// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // chamado de um Server Component, pode ignorar se tiver middleware fazendo refresh de sessão
          }
        },
        remove(name: string, options) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // idem acima
          }
        },
      },
    }
  );
}