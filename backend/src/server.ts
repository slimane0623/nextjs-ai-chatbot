import dotenv from 'dotenv'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createApp } from './core/app.js'
import { port } from './core/config.js'

const currentDir = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(currentDir, '..', '.env')
dotenv.config({ path: envPath })

const app = createApp()

app.listen(port, () => {
  console.log(`MediStock API running on http://localhost:${port}`)
})
