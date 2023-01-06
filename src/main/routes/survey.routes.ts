import { Router } from 'express'
import { adapteRoute } from '../adapters/express.route.adapter'
import { AddSurveyControllerFactory } from '../factories/controllers/survey/add-survey'

export default (router: Router): void => {
  router.post('/surveys', adapteRoute(AddSurveyControllerFactory()))
}