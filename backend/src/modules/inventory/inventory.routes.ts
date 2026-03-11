import { Router } from 'express'
import { z } from 'zod'
import { listInventory } from '../../db.js'

export const inventoryRouter = Router()

inventoryRouter.get('/', (request, response) => {
  const querySchema = z.object({
    search: z.string().optional(),
    status: z.enum(['ok', 'critical', 'expiring', 'out']).optional(),
  })

  const parsed = querySchema.safeParse(request.query)

  if (!parsed.success) {
    response.status(400).json({ error: 'Invalid query parameters' })
    return
  }

  response.json(listInventory(parsed.data.search ?? '', parsed.data.status))
})
