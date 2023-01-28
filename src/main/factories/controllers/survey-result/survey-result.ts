import { createLogControllerDecoratorFactory } from '@/main/factories/usecases/log-controller.factory'
import { LoadSurveyResultController } from '@/presentation/controllers/load-survey-result/load-survey-result.controller'
import { SaveSurveyResultController } from '@/presentation/controllers/save-survey-result/save-survey-result.controller'
import { Controller } from '@/presentation/protocols'
import { createDbLoadSurveyByIdFactory } from '../../usecases/db-load-survey-by-id'
import { createDbLoadSurveyResultFactory } from '../../usecases/db-load-survey-result.factory'
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

export const LoadSurveyResultControllerFactory = (): Controller => {
  const dbLoadSurveyById = createDbLoadSurveyByIdFactory()
  const dbLoadSurveyResult = createDbLoadSurveyResultFactory()
  const loadSurveyResultController = new LoadSurveyResultController(
    dbLoadSurveyById, 
    dbLoadSurveyResult
  )
  return createLogControllerDecoratorFactory(loadSurveyResultController)
}