import { Controller } from "@/presentation/protocols"
import { Request, Response } from 'express'

export const adapteRoute = (controller: Controller) => {

  return async (req: Request, res: Response) => {
    const request = { 
      ...(req.body || {}), 
      ...(req.params || {}),
      accountId: req.accountId
    }

    const httpResponse = await controller.handle(request)

    if (httpResponse.statusCode === 500) {
      res.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
    }

    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}