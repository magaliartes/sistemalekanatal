export default function NovaArvorePage() {
  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-700 to-yellow-600 text-white shadow-lg border-b-4 border-yellow-400">
        <div className="container-main py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">➕</span>
              <div>
                <h1 className="text-3xl font-black">Nova Árvore</h1>
                <p className="text-yellow-100">Cadastre uma nova árvore no estoque</p>
              </div>
            </div>
            <Link href="/estoque/arvores">
              <button className="btn btn-outline border-white text-white hover:bg-white/20">
                ← Voltar
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="container-main py-10">
        <div className="max-w-2xl mx-auto card">
          <form className="space-y-6">
            {/* Seção: Informações */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-yellow-300">
                🎄 Informações da Árvore
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Número de Patrimônio *
                  </label>
                  <input
                    type="text"
                    placeholder="ARV-001"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Modelo *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
                  >
                    <option value="">Selecione um modelo...</option>
                    <option value="1">Pequena (1.5m)</option>
                    <option value="2">Média (2.2m)</option>
                    <option value="3">Grande (3.0m)</option>
                    <option value="4">Gigante (4.0m)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    defaultValue="disponivel"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
                  >
                    <option value="disponivel">Disponível</option>
                    <option value="em_uso">Em Uso</option>
                    <option value="manutencao">Manutenção</option>
                    <option value="descartada">Descartada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    placeholder="Ex: Reparada em 2024, pintura renovada..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
              <Link href="/estoque/arvores" className="flex-1">
                <button
                  type="button"
                  className="w-full btn btn-outline text-gray-700"
                >
                  ← Cancelar
                </button>
              </Link>
              <button
                type="submit"
                className="flex-1 btn btn-primary"
              >
                ✅ Cadastrar Árvore
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}