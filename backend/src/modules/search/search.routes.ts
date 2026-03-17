import { Router } from 'express'
import { z } from 'zod'
import { searchGlobal, type GlobalSearchCategory } from '../../db.js'

export const searchRouter = Router()

const categorySchema = z.enum(['inventory', 'profiles', 'history'])

searchRouter.get('/', (request, response) => {
  const querySchema = z.object({
    q: z.string().trim().max(120).default(''),
    categories: z.string().trim().optional(),
    inventoryStatus: z.enum(['ok', 'critical', 'expiring', 'out']).optional(),
    movementType: z.enum(['prise', 'ajout', 'alerte']).optional(),
    profileId: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().min(1).max(50).optional(),
  })

  const parsed = querySchema.safeParse(request.query)

  if (!parsed.success) {
    response.status(400).json({ error: 'Invalid query parameters' })
    return
  }

  let categories: GlobalSearchCategory[] | undefined

  if (parsed.data.categories) {
    const rawCategories = parsed.data.categories
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)

    const categoryValidation = z.array(categorySchema).safeParse(rawCategories)

    if (!categoryValidation.success || categoryValidation.data.length === 0) {
      response.status(400).json({ error: 'Invalid categories filter' })
      return
    }

    categories = Array.from(new Set(categoryValidation.data))
  }

  response.json(searchGlobal({
    query: parsed.data.q,
    categories,
    inventoryStatus: parsed.data.inventoryStatus,
    movementType: parsed.data.movementType,
    profileId: parsed.data.profileId,
    limitPerCategory: parsed.data.limit,
  }))
})
