// src/hooks/useAuth.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { LoginCredentials, AuthResponse, Usuario } from '../types';

interface AuthResult {
  success: boolean;
  error?: string;
  data?: AuthResponse;
}

export function useAuth() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar autenticação no mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          // Buscar dados do usuário na tabela usuarios
          const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) throw error;
          setUsuario(data as Usuario);
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Auth check error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [supabase]);

  // Login
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResult> => {
      try {
        setIsLoading(true);
        setError(null);

        // Autenticar com Supabase
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (authError) throw authError;

        if (!data.user) {
          throw new Error('Usuário não encontrado');
        }

        // Buscar dados do usuário
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError) throw userError;

        const usuarioData = userData as Usuario;
        setUsuario(usuarioData);

        // Salvar token no localStorage
        if (data.session?.access_token) {
          localStorage.setItem('auth_token', data.session.access_token);
          localStorage.setItem('refresh_token', data.session.refresh_token || '');
        }

        return {
          success: true,
          data: {
            usuario: usuarioData,
            token: data.session?.access_token || '',
            refreshToken: data.session?.refresh_token || '',
            expiresIn: 3600,
          },
        };
      } catch (err: any) {
        const message = err.message || 'Erro ao fazer login';
        setError(message);
        return {
          success: false,
          error: message,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [supabase]
  );

  // Logout
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUsuario(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, router]);

  // Verificar se está autenticado
  const isAuthenticated = !!usuario;

  // Verificar permissão
  const hasPermission = useCallback((requiredPerfil: string) => {
    return usuario?.perfil === requiredPerfil || usuario?.perfil === 'administrador';
  }, [usuario]);

  return {
    usuario,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    hasPermission,
  };
}