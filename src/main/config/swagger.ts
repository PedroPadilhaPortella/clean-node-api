import { Express } from 'express'
import swaggerConfig from '../docs'
import { noCache } from '../middlewares/no-cache.middleware'
import { serve, setup } from 'swagger-ui-express'

export default (app: Express): void => {
  app.use('/api/swagger', noCache, serve, setup(swaggerConfig))
}