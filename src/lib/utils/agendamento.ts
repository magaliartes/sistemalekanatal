export function gerarTituloAgendamento(
  tipo: string,
  nomeCliente: string,
  descricao?: string
) {
  const prefixos: Record<string, string> = {
    montagem: '[M]',
    desmontagem: '[D]',
  };

  const prefixo = prefixos[tipo] ?? '';

  const palavrasNomeCompleto = [
    'condomínio',
    'condominio',
    'residencial',
    'edifício',
    'edificio',
    'empresa',
    'shopping',
    'hotel',
    'clube',
  ];

  let nomeExibicao = nomeCliente.trim();

  const primeiraPalavra = nomeExibicao
    .split(' ')[0]
    .toLowerCase();

  if (!palavrasNomeCompleto.includes(primeiraPalavra)) {
    nomeExibicao = nomeExibicao.split(' ')[0];
  }

  if (!prefixo) {
    return descricao
      ? `${nomeExibicao} - ${descricao}`
      : nomeExibicao;
  }

  return descricao?.trim()
    ? `${prefixo} ${nomeExibicao} - ${descricao.trim()}`
    : `${prefixo} ${nomeExibicao}`;
}