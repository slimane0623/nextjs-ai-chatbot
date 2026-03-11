import { Router } from 'express'
import { listMovements } from '../../db.js'

export const historyRouter = Router()

historyRouter.get('/', (_request, response) => {
  response.json(listMovements())
})
