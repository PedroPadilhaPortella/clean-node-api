import { AccountModel } from '@/domain/models/account.model'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SurveyModel } from "@/domain/models/survey.model"
import { AddAccountParams } from '@/domain/usecases/add-account.interface'
import { AddSurveyParams } from '@/domain/usecases/add-survey.interface'
import { SaveSurveyResultParams } from '@/domain/usecases/save-survey-result.interface'

export const LOGIN = {
  email: 'pedro@gmail.com',
  password: 'pedro123'
}

export const SIGNUP = {
  name: 'pedro',
  email: 'pedro@gmail.com',
  password: 'pedro123',
  passwordConfirmation: 'pedro123'
}

export const ADD_ACCOUNT: AddAccountParams = SIGNUP

export const ACCOUNT: AccountModel = { id: '1', ...ADD_ACCOUNT }

export const ADD_SURVEY: AddSurveyParams = {
  question: 'question',
  answers: [
    { answer: 'answer1', image: 'image1' },
    { answer: 'answer2', image: 'image2' },
    { answer: 'answer3' }
  ],
  date: new Date()
}

export const SURVEY: SurveyModel = { id: '1', ...ADD_SURVEY }

export const SURVEYS: SurveyModel[] = [
  {
    id: '1',
    question: 'question1',
    date: new Date(),
    answers: [
      { answer: 'answer1', image: 'image1' },
      { answer: 'answer2', image: 'image2' },
      { answer: 'answer3' }
    ]
  },
  {
    id: '2',
    question: 'question2',
    date: new Date(),
    answers: [
      { answer: 'answer1', image: 'image1' },
      { answer: 'answer2' },
      { answer: 'answer3', image: 'image3' }
    ]
  }
]

export const SAVE_SURVEY_RESULT: SaveSurveyResultParams = {
  surveyId: '1',
  accountId: '1',
  answer: 'answer1',
  date: new Date()
}

export const SURVEY_RESULT: SurveyResultModel = {
  surveyId: '1',
  question: 'question',
  answers: [
    {
      answer: 'answer1',
      count: 1,
      percent: 50, 
      image: 'image1'
    },
    {
      answer: 'answer2',
      count: 1,
      percent: 50, 
      image: 'image2'
    }
  ],
  date: new Date()
}
