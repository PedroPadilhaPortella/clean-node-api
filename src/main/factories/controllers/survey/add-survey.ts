import { Controller } from '../../../../presentation/protocols'
import { createDbAddSurveyFactory } from '../../usecases/db-add-survey.factory'
import { createLogControllerDecoratorFactory } from '../../usecases/log-controller.factory'
import { AddSurveyController } from './../../../../presentation/controllers/add-survey/add-survey.controller'
import { createAddSurveyValidations } from './add-survey-validation'

export const AddSurveyControllerFactory = (): Controller => {
  const dbAddSurvey = createDbAddSurveyFactory()
  const validations = createAddSurveyValidations()
  const addSurveyController = new AddSurveyController(dbAddSurvey, validations)
  return createLogControllerDecoratorFactory(addSurveyController)
}