import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1D4ED8',
          secondary: '#64748B',
          success: '#059669',
          warning: '#D97706',
          error: '#DC2626',
          info: '#0284C7',
          background: '#F8FAFC',
          surface: '#FFFFFF',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
  },
  defaults: {
    VCard: {
      rounded: 'lg',
      elevation: 1,
    },
    VBtn: {
      rounded: 'lg',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
  },
})
