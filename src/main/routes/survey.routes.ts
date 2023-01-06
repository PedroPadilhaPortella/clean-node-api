import { Router } from 'express'
import { adapteMiddleware } from '../adapters/express.middleware.adapter'
import { adapteRoute } from '../adapters/express.route.adapter'
import { AddSurveyControllerFactory } from '../factories/controllers/survey/add-survey'
import { AuthMiddlewareFactory } from '../factories/middlewares/auth-middleware'

export default (router: Router): void => {
  const adminAuth = adapteMiddleware(AuthMiddlewareFactory('admin'))
  router.post('/surveys', adminAuth, adapteRoute(AddSurveyControllerFactory()))
}