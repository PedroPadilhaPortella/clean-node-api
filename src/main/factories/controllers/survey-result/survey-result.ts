import { createLogControllerDecoratorFactory } from '@/main/factories/usecases/log-controller.factory'
import { SaveSurveyResultController } from '@/presentation/controllers/save-survey-result/save-survey-result.controller'
import { Controller } from '@/presentation/protocols'
import { createDbLoadSurveyByIdFactory } from '../../usecases/db-load-survey-by-id'
import { createDbSaveSurveyResultFactory } from '../../usecases/db-save-survey-result'

export const SaveSurveyResultControllerFactory = (): Controller => {
  const dbLoadSurveyById = createDbLoadSurveyByIdFactory()
  const dbSaveSurveyResult = createDbSaveSurveyResultFactory()
  const saveSurveyResultController = new SaveSurveyResultController(
    dbLoadSurveyById, 
    dbSaveSurveyResult
  )
  return createLogControllerDecoratorFactory(saveSurveyResultController)
}