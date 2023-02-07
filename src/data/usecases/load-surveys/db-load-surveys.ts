import { LoadSurveys, LoadSurveysRepository } from "./db-load-surveys.protocols"

export class DbLoadSurveys implements LoadSurveys {

  constructor (
    private readonly loadSurveysRepository: LoadSurveysRepository
  ) {}

  async load (accountId: string): Promise<LoadSurveysRepository.Result> {
    return await this.loadSurveysRepository.loadAll(accountId)
  }
}