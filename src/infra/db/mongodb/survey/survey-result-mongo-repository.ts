import { LoadSurveyResultRepository } from '@/data/protocols/load-survey-result-repository.interface'
import { SaveSurveyResultRepository } from '@/data/protocols/save-survey-result.repository'
import { CollectionsEnum } from '@/domain/enums/collections.enum'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/save-survey-result.interface'
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo.helper"
import { ObjectId } from 'mongodb'

export class SurveyResultMongoRepository 
implements SaveSurveyResultRepository, LoadSurveyResultRepository {

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = MongoHelper.getCollection(CollectionsEnum.SURVEY_RESULTS)
    const { accountId, surveyId, answer, date } = data

    await surveyResultCollection.findOneAndUpdate(
      { accountId: new ObjectId(accountId), surveyId: new ObjectId(surveyId) },
      { $set: { answer, date } },
      { upsert: true }
    )

    const surveyResult = await this.loadBySurveyId(data.surveyId)
    return surveyResult
  }

  async loadBySurveyId (surveyId: string | ObjectId): Promise<SurveyResultModel> {
    const surveyResultCollection = MongoHelper.getCollection(CollectionsEnum.SURVEY_RESULTS)
    const query = surveyResultCollection.aggregate([
      {
        $match: {
          surveyId: new ObjectId(surveyId)
        }
      },
      {
        $group: {
          _id: 0,
          data: {
            $push: "$$ROOT"
          },
          total: {
            $sum: 1
          }
        }
      },
      {
        $unwind: {
          path: "$data"
        }
      },
      {
        $lookup: {
          from: "surveys",
          localField: "data.surveyId",
          foreignField: "_id",
          as: "survey"
        }
      },
      {
        $unwind: {
          path: "$survey"
        }
      },
      {
        $group: {
          _id: {
            surveyId: "$survey._id",
            question: "$survey.question",
            date: "$survey.date",
            total: "$total",
            answer: "$data.answer",
            answers: "$survey.answers"
          },
          count: {
            $sum: 1
          }
        }
      },
      {
        $project: {
          _id: 0,
          surveyId: "$_id.surveyId",
          question: "$_id.question",
          date: "$_id.date",
          answers: {
            $map: {
              input: "$_id.answers",
              as: "item",
              in: {
                $mergeObjects: ["$$item", {
                  count: {
                    $cond: {
                      if: {
                        $eq: ['$$item.answer', '$_id.answer']
                      },
                      then: '$count',
                      else: 0
                    }
                  },
                  percent: {
                    $cond: {
                      if: {
                        $eq: ['$$item.answer', '$_id.answer']
                      },
                      then: {
                        $multiply: [
                          {
                            $divide: ['$count', '$_id.total']
                          },
                          100
                        ]
                      },
                      else: 0
                    }
                  },
                  isCurrentAccountAnswer: {
                    $eq: [
                      '$$item.answer',
                      { $arrayElemAt: ['$currentAccountAnswer', 0] }
                    ]
                  }
                }]
              }
            }
          }
        }
      },
      {
        $group: {
          _id: {
            surveyId: '$surveyId',
            question: '$question',
            date: '$date'
          },
          answers: {
            $push: '$answers'
          }
        }
      },
      {
        $project: {
          _id: 0,
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date',
          answers: {
            $reduce: {
              input: '$answers',
              initialValue: [],
              in: {
                $concatArrays: ['$$value', '$$this']
              }
            }
          }
        }
      },
      {
        $unwind: {
          path: "$answers"
        }
      },
      {
        $group: {
          _id: {
            surveyId: '$surveyId',
            question: '$question',
            date: '$date',
            answer: '$answers.answer',
            image: '$answers.image',
            isCurrentAccountAnswer: '$answers.isCurrentAccountAnswer'
          },
          count: {
            $sum: '$answers.count'
          },
          percent: {
            $sum: '$answers.percent'
          }
        }
      },
      {
        $project: {
          _id: 0,
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date',
          answer: {
            answer: '$_id.answer',
            image: '$_id.image',
            count: '$count',
            percent: '$percent',
            isCurrentAccountAnswer: '$_id.isCurrentAccountAnswer'
          }
        }
      },
      {
        $sort: {
          'answer.count': -1
        }
      },
      {
        $group: {
          _id: {
            surveyId: '$surveyId',
            question: '$question',
            date: '$date'
          },
          answers: {
            $push: '$answer'
          }
        }
      },
      {
        $project: {
          _id: 0,
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date',
          answers: '$answers'
        }
      }
    ])

    const surveyResult = await query.toArray()
    return surveyResult.length ? surveyResult[0] as SurveyResultModel : null
  }
}