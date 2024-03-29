import { AddSurveyRepository } from '@/data/protocols/add-survey-repository.interface'
import { LoadSurveyByIdRepository } from '@/data/protocols/load-survey-by-id-repository.interface'
import { LoadSurveysRepository } from '@/data/protocols/load-surveys-repository.interface'
import { CollectionsEnum } from '@/domain/enums/collections.enum'
import { SurveyModel } from '@/domain/models/survey.model'
import { AddSurveyParams } from '@/domain/usecases/add-survey.interface'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo.helper'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository
implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {

  async add (survey: AddSurveyParams): Promise<void> {
    const surveyCollection = MongoHelper.getCollection(CollectionsEnum.SURVEYS)
    await surveyCollection.insertOne(survey)
  }

  async loadAll (accountId: string): Promise<SurveyModel[]> {
    const surveyCollection = MongoHelper.getCollection(CollectionsEnum.SURVEYS)

    const query = surveyCollection.aggregate([
      {
        $lookup: {
          from: CollectionsEnum.SURVEY_RESULT,
          foreignField: 'surveyId',
          localField: '_id',
          as: 'result'
        }
      },
      {
        $project: {
          _id: 1,
          question: 1,
          answers: 1,
          date: 1,
          didAnswer: {
            $gte: [
              {
                $size: {
                  $filter: {
                    input: '$result',
                    as: 'item',
                    cond: {
                      $eq: ['$$item.accountId', new ObjectId(accountId)]
                    }
                  }
                }
              },
              1
            ]
          }
        }
      }
    ])

    const results = await query.toArray()

    return results.map((result) => {
      return {
        id: result._id.toString(),
        question: result.question,
        answers: result.answers,
        date: result.date,
        didAnswer: result.didAnswer
      }
    })
  }

  async loadById (id: string): Promise<SurveyModel | null> {
    const surveyCollection = MongoHelper.getCollection(CollectionsEnum.SURVEYS)
    const result = await surveyCollection.findOne({ _id: new ObjectId(id) })

    return {
      id: result._id.toString(),
      question: result.question,
      answers: result.answers,
      date: result.date
    }
  }
}