import { describe, expect, it } from 'vitest'
import { formatarDecimal, formatarPercentual, obterStatusMetrica } from '../utils/aiMetricsFormatters'

describe('aiMetricsFormatters', () => {
  it('deve formatar percentual', () => {
    expect(formatarPercentual(0.681)).toBe('68.1%')
  })

  it('deve formatar decimal', () => {
    expect(formatarDecimal(0.087)).toBe('0.087')
  })

  it('deve identificar status corretamente', () => {
    expect(obterStatusMetrica(0.8)).toBe('sucesso')
    expect(obterStatusMetrica(0.5)).toBe('alerta')
    expect(obterStatusMetrica(0.2)).toBe('erro')
  })
})
