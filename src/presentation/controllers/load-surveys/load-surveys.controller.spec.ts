import MockDate from 'mockdate'
import { LoadSurveysController } from './load-surveys.controller'
import { LoadSurveys, SurveyModel } from './load-surveys.protocols'

const surveys: SurveyModel[] = [
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

const createLoadSurveysStub = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await new Promise(resolve => resolve(surveys))
    }
  }
  return new LoadSurveysStub()
}

interface SutTypes {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = createLoadSurveysStub()
  const sut = new LoadSurveysController(loadSurveysStub)
  return { sut, loadSurveysStub }
}

describe('LoadSurveysController', () => {

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
})