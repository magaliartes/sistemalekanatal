'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import ArvoresForm from '@/componentes/forms/ArvoresForm';

export default function EditarArvorePage() {
  const { id } = useParams<{ id: string }>();
  const [arvore, setArvore] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchArvore() {
      try {
        const response = await fetch(`/api/estoque/arvores/${id}`);
        if (!response.ok) {
          throw new Error('Árvore não encontrada');
        }
        const data = await response.json();
        setArvore(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar árvore');
      } finally {
        setIsLoading(false);
      }
    }

    if (id) fetchArvore();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">⏳ Carregando árvore...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-medium">⚠️ {error}</p>
      </div>
    );
  }

  return <ArvoresForm arvores={arvore} />;
}