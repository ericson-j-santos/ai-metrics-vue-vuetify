import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import AiStatCard from '../components/AiStatCard.vue'

describe('AiStatCard', () => {
  it('deve renderizar título, valor e subtítulo', () => {
    const wrapper = shallowMount(AiStatCard, {
      props: {
        titulo: 'Taxa de Aceitação',
        valor: '68.1%',
        subtitulo: '32/47',
        status: 'sucesso',
        tendencia: 2.3,
      },
      global: {
        stubs: {
          VCard: {
            template: '<div><slot /></div>',
          },
          VCardText: {
            template: '<div><slot /></div>',
          },
          VChip: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Taxa de Aceitação')
    expect(wrapper.text()).toContain('68.1%')
    expect(wrapper.text()).toContain('32/47')
    expect(wrapper.text()).toContain('+2.3%')
  })
})
