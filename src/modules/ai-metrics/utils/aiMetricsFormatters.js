export function formatarPercentual(valorDecimal) {
  return `${(valorDecimal * 100).toFixed(1)}%`
}

export function formatarDecimal(valor, casas = 3) {
  return Number(valor).toFixed(casas)
}

export function obterStatusMetrica(valorDecimal) {
  if (valorDecimal >= 0.7) return 'sucesso'
  if (valorDecimal >= 0.4) return 'alerta'
  return 'erro'
}

export function paraPorcentagemNumerica(valorDecimal) {
  return Number((valorDecimal * 100).toFixed(1))
}
