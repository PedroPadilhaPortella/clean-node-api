import { Router } from 'express'
import { adapteMiddleware } from '../adapters/express.middleware.adapter'
import { adapteRoute } from '../adapters/express.route.adapter'
import { LoadSurveyResultControllerFactory, SaveSurveyResultControllerFactory } from '../factories/controllers/survey-result/survey-result'
import { AuthMiddlewareFactory } from '../factories/middlewares/auth-middleware'

export default (router: Router): void => {
  const auth = adapteMiddleware(AuthMiddlewareFactory())
  
  router.put('/surveys/:surveyId/results', auth, adapteRoute(SaveSurveyResultControllerFactory()))
  router.get('/surveys/:surveyId/results', auth, adapteRoute(LoadSurveyResultControllerFactory()))
}