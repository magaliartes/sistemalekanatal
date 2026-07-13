'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import FuncionarioForm from '@/componentes/forms/FuncionarioForm';

export default function EditarFuncionarioPage() {
  const { id } = useParams<{ id: string }>();
  const [funcionario, setFuncionario] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchFuncionario() {
      try {
        const response = await fetch(`/api/funcionarios/${id}`);
        if (!response.ok) {
          throw new Error('Funcionário não encontrado');
        }
        const data = await response.json();
        setFuncionario(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar funcionário');
      } finally {
        setIsLoading(false);
      }
    }

    if (id) fetchFuncionario();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">⏳ Carregando funcionário...</p>
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

  return <FuncionarioForm funcionario={funcionario} />;
}