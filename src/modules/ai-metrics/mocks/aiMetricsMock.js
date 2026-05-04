export const aiMetricsMock = {
  janela_dias: 30,
  amostras_total: 47,
  interpretacao_geral:
    'Com 47 outcomes, a IA tem taxa de aceitação de 68,1% e eficácia pós-correção de 81,0%. Aceitação alta com eficácia alta indica boa confiabilidade operacional.',
  metricas: {
    taxa_aceitacao: {
      valor: { taxa: 0.681, aceitas: 32, total: 47 },
      tendencia: 2.3,
    },
    eficacia_pos_correcao: {
      valor: { taxa: 0.81, sucessos: 17, avaliadas: 21 },
      tendencia: 4.1,
    },
    calibracao: {
      valor: {
        bins: [
          { confianca_media: 0.13, taxa_outcome_positivo: 0.2, n_amostras: 5 },
          { confianca_media: 0.31, taxa_outcome_positivo: 0.4, n_amostras: 5 },
          { confianca_media: 0.52, taxa_outcome_positivo: 0.5, n_amostras: 8 },
          { confianca_media: 0.71, taxa_outcome_positivo: 0.78, n_amostras: 14 },
          { confianca_media: 0.88, taxa_outcome_positivo: 0.85, n_amostras: 15 },
        ],
        ece: 0.038,
        brier_score: 0.087,
      },
    },
    por_tipo: {
      valor: [
        { tipo: 'Hotfix', taxa_aceitacao: 0.875, taxa_eficacia: 0.857, amostras: 8 },
        { tipo: 'Próx. versão', taxa_aceitacao: 0.778, taxa_eficacia: 0.846, amostras: 9 },
        { tipo: 'Backlog', taxa_aceitacao: 0.571, taxa_eficacia: 0.625, amostras: 21 },
        { tipo: 'Monitorar', taxa_aceitacao: 0.286, taxa_eficacia: null, amostras: 9 },
      ],
    },
    tendencia_30d: {
      valor: [
        { data_fim: '12-01', taxa_aceitacao: 0.55, taxa_eficacia: 0.6 },
        { data_fim: '12-08', taxa_aceitacao: 0.58, taxa_eficacia: 0.65 },
        { data_fim: '12-15', taxa_aceitacao: 0.61, taxa_eficacia: 0.68 },
        { data_fim: '12-22', taxa_aceitacao: 0.63, taxa_eficacia: 0.7 },
        { data_fim: '12-29', taxa_aceitacao: 0.65, taxa_eficacia: 0.72 },
        { data_fim: '01-05', taxa_aceitacao: 0.66, taxa_eficacia: 0.73 },
        { data_fim: '01-12', taxa_aceitacao: 0.69, taxa_eficacia: 0.75 },
        { data_fim: '01-19', taxa_aceitacao: 0.68, taxa_eficacia: 0.74 },
        { data_fim: '01-26', taxa_aceitacao: 0.71, taxa_eficacia: 0.76 },
        { data_fim: '02-02', taxa_aceitacao: 0.68, taxa_eficacia: 0.74 },
      ],
    },
    evidencias: {
      valor: {
        acertos_alta_confianca: [
          {
            titulo: 'Cadastro / Salvar: CPF inválido',
            recomendacao: 'Hotfix em validação',
            confianca: 0.91,
            score: 0.84,
          },
          {
            titulo: 'Login / Auth: token expirado',
            recomendacao: 'Renovar automaticamente',
            confianca: 0.87,
            score: 0.79,
          },
        ],
        erros_alta_confianca: [
          {
            titulo: 'Relatórios / Export: timeout PDF',
            recomendacao: 'Aumentar timeout',
            confianca: 0.82,
            score: 0.21,
          },
        ],
        acertos_baixa_confianca: [
          {
            titulo: 'Dashboard / Filtro: data inválida',
            recomendacao: 'Validação client-side',
            confianca: 0.42,
            score: 0.78,
          },
        ],
      },
    },
  },
}
