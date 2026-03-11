import { Router } from 'express'
import { listProfiles } from '../../db.js'

export const profilesRouter = Router()

profilesRouter.get('/', (_request, response) => {
  response.json(listProfiles())
})
