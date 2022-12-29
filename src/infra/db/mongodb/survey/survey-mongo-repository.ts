import { AddSurveyRepository } from '../../../../data/protocols/add-survey-repository.interface'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey.interface'
import { MongoHelper } from '../helpers/mongo.helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  
  async add (survey: AddSurveyModel): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(survey)
  }
}