import { AddSurveyRepository } from '@/data/protocols/add-survey-repository.interface'
import { LoadSurveyByIdRepository } from '@/data/protocols/load-survey-by-id-repository.interface'
import { LoadSurveysRepository } from '@/data/protocols/load-surveys-repository.interface'
import { CollectionsEnum } from '@/domain/enums/collections.enum'
import { SurveyModel } from '@/domain/models/survey.model'
import { AddSurveyModel } from '@/domain/usecases/add-survey.interface'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo.helper'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository 
implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  
  async add (survey: AddSurveyModel): Promise<void> {
    const surveyCollection = MongoHelper.getCollection(CollectionsEnum.SURVEYS)
    await surveyCollection.insertOne(survey)
  }
  
  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = MongoHelper.getCollection(CollectionsEnum.SURVEYS)
    return await surveyCollection.find().toArray() as unknown as SurveyModel[]
  }
  
  async loadById (id: string): Promise<SurveyModel | null> {
    const surveyCollection = MongoHelper.getCollection(CollectionsEnum.SURVEYS)
    const result = await surveyCollection.findOne({ _id: new ObjectId(id) })

    if (result) {
      return { 
        id: result._id.toString(),
        question: result.question,
        answers: result.answers,
        date: result.date
      }
    }
    return null
  }
}