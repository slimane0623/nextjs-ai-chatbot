import { Router } from 'express'
import { z } from 'zod'
import { ChatServiceError, chatTimeoutMs, generateLocalChatReply, getLocalModelStatus } from './chat.service.js'

export const chatRouter = Router()

const chatRoleSchema = z.enum(['user', 'assistant'])

const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(1200),
  history: z.array(z.object({
    role: chatRoleSchema,
    content: z.string().trim().min(1).max(1200),
  })).max(24).optional(),
  requestId: z.string().trim().min(1).max(80).optional(),
})

chatRouter.get('/status', async (_request, response) => {
  const status = await getLocalModelStatus()

  response.json({
    ok: true,
    ...status,
  })
})

chatRouter.post('/', async (request, response) => {
  const parsed = chatRequestSchema.safeParse(request.body)

  if (!parsed.success) {
    response.status(400).json({
      ok: false,
      error: {
        code: 'INVALID_PAYLOAD',
        message: 'Invalid chat payload',
      },
    })
    return
  }

  const startedAt = Date.now()

  try {
    const reply = await generateLocalChatReply({
      message: parsed.data.message,
      history: parsed.data.history,
    })

    response.json({
      ok: true,
      requestId: parsed.data.requestId ?? null,
      reply: reply.reply,
      disclaimer: reply.disclaimer,
      meta: {
        provider: reply.provider,
        model: reply.model,
        latencyMs: Date.now() - startedAt,
        timeoutMs: chatTimeoutMs,
      },
    })
  } catch (error) {
    const isChatError = error instanceof ChatServiceError
    const code = isChatError ? error.code : 'INTERNAL_ERROR'
    const statusCode = code === 'TIMEOUT'
      ? 504
      : code === 'MODEL_UNAVAILABLE'
        ? 503
        : 500

    const message = isChatError
      ? error.message
      : 'Erreur interne du service de chat local.'

    response.status(statusCode).json({
      ok: false,
      requestId: parsed.data.requestId ?? null,
      error: {
        code,
        message,
      },
      meta: {
        provider: null,
        model: null,
        latencyMs: Date.now() - startedAt,
        timeoutMs: chatTimeoutMs,
      },
    })
  }
})
