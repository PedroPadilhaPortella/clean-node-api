import { loginPath } from './paths/loginPath'
import { AccountSchema } from './schemas/account.schema'
import { LoginParamsSchema } from './schemas/login-params.schema'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API de enquetes entre programadores',
    version: '2.2.1'
  },
  servers: [
    { url: '/api' }
  ],
  tags: [
    { name: 'Login' }
  ],
  paths: {
    '/login': loginPath
  },
  schemas: {
    Account: AccountSchema,
    Login: LoginParamsSchema
  }
}