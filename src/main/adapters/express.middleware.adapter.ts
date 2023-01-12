import { NextFunction, Request, Response } from 'express'
import { HttpRequest, Middleware } from "@/presentation/protocols"

export const adapteMiddleware = (middleware: Middleware) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = request
    const httpResponse = await middleware.handle(httpRequest)

    if (httpResponse.statusCode === 200) {
      Object.assign(request, httpResponse.body)
      return next()
    }
    
    response.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
  }
}