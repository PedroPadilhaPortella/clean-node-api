import { Router } from 'express'
import { adapteMiddleware } from '../adapters/express.middleware.adapter'
import { adapteRoute } from '../adapters/express.route.adapter'
import { AddSurveyControllerFactory, LoadSurveysControllerFactory } from '../factories/controllers/survey/survey'
import { AuthMiddlewareFactory } from '../factories/middlewares/auth-middleware'

export default (router: Router): void => {
  const adminAuth = adapteMiddleware(AuthMiddlewareFactory('admin'))
  const auth = adapteMiddleware(AuthMiddlewareFactory())
  
  router.post('/surveys', adminAuth, adapteRoute(AddSurveyControllerFactory()))
  router.get('/surveys', auth, adapteRoute(LoadSurveysControllerFactory()))
}