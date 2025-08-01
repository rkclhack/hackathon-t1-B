import "vuetify/styles"
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
import "@mdi/font/css/materialdesignicons.css"

const customTheme = {
  colors: {
    primary: "#42b983",
    secondary: "#e0e0e0",
    error: "#dc3545",
    info: "#3498db",
    success: "#28a745",
    warning: "#ffc107",
  }
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "customTheme",
    themes: { customTheme }
  },
})