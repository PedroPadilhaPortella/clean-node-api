import { createDbAddSurveyFactory } from '@/main/factories/usecases/db-add-survey.factory'
import { createDbLoadSurveyFactory } from '@/main/factories/usecases/db-load-surveys.factory'
import { createLogControllerDecoratorFactory } from '@/main/factories/usecases/log-controller.factory'
import { AddSurveyController } from '@/presentation/controllers/add-survey/add-survey.controller'
import { LoadSurveysController } from '@/presentation/controllers/load-surveys/load-surveys.controller'
import { Controller } from '@/presentation/protocols'
import { createAddSurveyValidations } from './add-survey-validation'

export const AddSurveyControllerFactory = (): Controller => {
  const dbAddSurvey = createDbAddSurveyFactory()
  const validations = createAddSurveyValidations()
  const addSurveyController = new AddSurveyController(dbAddSurvey, validations)
  return createLogControllerDecoratorFactory(addSurveyController)
}

export const LoadSurveysControllerFactory = (): Controller => {
  const dbLoadSurvey = createDbLoadSurveyFactory()
  const loadSurveysController = new LoadSurveysController(dbLoadSurvey)
  return createLogControllerDecoratorFactory(loadSurveysController)
}