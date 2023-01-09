import { AddSurveyRepository } from '../../../../data/protocols/add-survey-repository.interface'
import { LoadSurveysRepository } from '../../../../data/protocols/load-surveys-repository.interface'
import { SurveyModel } from '../../../../domain/models/survey.model'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey.interface'
import { MongoHelper } from '../helpers/mongo.helper'
import { CollectionsEnum } from './../../../../domain/enums/collections.enum'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  
  async add (survey: AddSurveyModel): Promise<void> {
    const surveyCollection = MongoHelper.getCollection(CollectionsEnum.SURVEYS)
    await surveyCollection.insertOne(survey)
  }
  
  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = MongoHelper.getCollection(CollectionsEnum.SURVEYS)
    const surveys: any = await surveyCollection.find().toArray()
    return surveys
  }
}