// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'
import store from '../store/index.js'

export default createVuetify(
    {
        theme: {
            defaultTheme: store.state.theme,
        }
    }
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
)
