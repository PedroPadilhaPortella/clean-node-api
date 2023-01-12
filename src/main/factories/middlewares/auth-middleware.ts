import { AuthMiddleware } from "@/presentation/middlewares/middlewares.protocols"
import { Middleware } from "@/presentation/protocols"
import { createDbLoadAccountByTokenFactory } from "../usecases/db-load-account-by-token.factory"

export const AuthMiddlewareFactory = (role?: string): Middleware => {
  const loadAccountByToken = createDbLoadAccountByTokenFactory()
  return new AuthMiddleware(loadAccountByToken, role)
}