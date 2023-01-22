import { badRequest, notFound, serverError, unauthorized } from './components'
import { loginPath, signupPath } from './paths'
import { AccountSchema, ErrorSchema, LoginParamsSchema, SignUpSchema } from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API de enquetes entre programadores',
    version: '2.2.1'
  },
  contact: {
    name: 'Pedro Padilha Portella',
    url: 'https://www.linkedin.com/in/pedro-padilha-portella-02a67318a/'
  },
  servers: [
    { url: '/api' }
  ],
  tags: [
    { name: 'Login' }
  ],
  paths: {
    '/login': loginPath,
    '/signup': signupPath
  },
  schemas: {
    Account: AccountSchema,
    SignUp: SignUpSchema,
    Login: LoginParamsSchema,
    Error: ErrorSchema
  },
  components: {
    badRequest,
    unauthorized,
    serverError,
    notFound
  }
}