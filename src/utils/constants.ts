import { AccountModel } from './../domain/models/account.model'
import { SurveyModel } from "../domain/models/survey.model"
import { AddSurveyModel } from './../domain/usecases/add-survey.interface'

export const SIGNUP = {
  name: 'pedro',
  email: 'pedro@gmail.com',
  password: 'pedro123',
  passwordConfirmation: 'pedro123'
}

export const ACCOUNT: AccountModel = { 
  id: '1', 
  email: 'pedro@gmail.com', 
  name: 'pedro', 
  password: 'pedro123' 
}

export const SURVEY: AddSurveyModel = {
  question: 'question',
  answers: [
    { answer: 'answer1', image: 'image1' },
    { answer: 'answer2', image: 'image2' },
    { answer: 'answer3' }
  ],
  date: new Date()
}

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
