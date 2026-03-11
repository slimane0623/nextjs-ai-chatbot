import { createApp } from './core/app.js'
import { port } from './core/config.js'

const app = createApp()

app.listen(port, () => {
  console.log(`MediStock API running on http://localhost:${port}`)
})
