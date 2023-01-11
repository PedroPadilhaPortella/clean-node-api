import { SurveyModel } from "../../../domain/models/survey.model"
import { LoadSurveys } from "../../../domain/usecases/load-surveys.interface"
import { LoadSurveysRepository } from "../../protocols/load-surveys-repository.interface"

export class DbLoadSurveys implements LoadSurveys {

  constructor (
    private readonly loadSurveysRepository: LoadSurveysRepository
  ) {}

  async load (): Promise<SurveyModel[]> {
    return await this.loadSurveysRepository.loadAll()
  }
}