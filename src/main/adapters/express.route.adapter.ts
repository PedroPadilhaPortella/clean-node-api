import { Controller, HttpRequest } from "@/presentation/protocols"
import { Request, Response } from 'express'

export const adapteRoute = (controller: Controller) => {

  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = { 
      body: req.body, 
      params: req.params,
      accountId: req.accountId
    }

    const httpResponse = await controller.handle(httpRequest)

    if (httpResponse.statusCode === 500) {
      res.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
    }

    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}