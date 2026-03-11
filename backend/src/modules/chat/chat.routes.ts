import { Router } from 'express'
import { z } from 'zod'

export const chatRouter = Router()

chatRouter.post('/', (request, response) => {
  const bodySchema = z.object({
    message: z.string().min(1),
  })

  const parsed = bodySchema.safeParse(request.body)

  if (!parsed.success) {
    response.status(400).json({ error: 'Message is required' })
    return
  }

  const lowerMessage = parsed.data.message.toLowerCase()

  let answer = 'Je peux aider pour le stock, les alertes et les profils. L avis d un professionnel de sante reste indispensable.'

  if (lowerMessage.includes('stock')) {
    answer = 'Le stock est gere localement. Je peux t aider a verifier les medicaments critiques et ceux proches de la peremption.'
  } else if (lowerMessage.includes('prise')) {
    answer = 'Pour enregistrer une prise, selectionne un medicament dans l inventaire puis utilise l action rapide correspondante.'
  } else if (lowerMessage.includes('interaction')) {
    answer = 'Je peux signaler des points d attention, mais je ne remplace pas un pharmacien ni un medecin.'
  }

  response.json({
    reply: answer,
    disclaimer: 'Assistant local informatif uniquement. Ne remplace pas un avis medical professionnel.',
  })
})
