import cors from 'cors'
import express from 'express'
import { corsOrigin } from './config.js'
import { registerApiRoutes } from '../modules/index.js'

export function createApp() {
  const app = express()

  app.use(cors({ origin: corsOrigin }))
  app.use(express.json())

  registerApiRoutes(app)

  return app
}
