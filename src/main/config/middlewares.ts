import { Express } from 'express'
import { bodyParser } from '../middlewares/body-parser.middleware'
import { cors } from '../middlewares/cors.middleware'
import { contentType } from '../middlewares/content-type.middleware'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
}