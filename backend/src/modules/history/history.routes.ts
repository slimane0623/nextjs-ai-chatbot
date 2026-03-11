import { Router } from 'express'
import { z } from 'zod'
import { listMovements } from '../../db.js'

export const historyRouter = Router()

historyRouter.get('/', (request, response) => {
  const querySchema = z.object({
    type: z.enum(['prise', 'ajout', 'alerte']).optional(),
    profileId: z.coerce.number().int().positive().optional(),
  })

  const parsed = querySchema.safeParse(request.query)

  if (!parsed.success) {
    response.status(400).json({ error: 'Invalid query parameters' })
    return
  }

  response.json(listMovements(parsed.data))
})
