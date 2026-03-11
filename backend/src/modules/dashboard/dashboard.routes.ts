import { Router } from 'express'
import { getDashboard } from '../../db.js'

export const dashboardRouter = Router()

dashboardRouter.get('/', (_request, response) => {
  response.json(getDashboard())
})
