'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ClienteForm from '@/componentes/forms/ClienteForm';

export default function EditarClientePage() {
  const { id } = useParams<{ id: string }>();
  const [cliente, setCliente] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCliente() {
      try {
        const response = await fetch(`/api/clientes/${id}`);
        if (!response.ok) {
          throw new Error('Cliente não encontrado');
        }
        const data = await response.json();
        setCliente(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar cliente');
      } finally {
        setIsLoading(false);
      }
    }

    if (id) fetchCliente();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">⏳ Carregando cliente...</p>
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

  return <ClienteForm cliente={cliente} />;
}