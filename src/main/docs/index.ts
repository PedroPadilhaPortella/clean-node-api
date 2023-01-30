import { badRequest, forbidden, notFound, serverError, unauthorized } from './components'
import { loginPath, signUpPath, surveyPath, surveyResultPath } from './paths'
import { AccountSchema, AddSurveyParamsSchema, ApiKeyAuthSchema, ErrorSchema, LoginParamsSchema, SaveSurveyResultParamsSchema, SignUpSchema, SurveyAnswerSchema, SurveySchema, SurveysSchema, SurveyResultSchema, SurveyResultAnswerSchema } from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API de enquetes entre programadores',
    version: '2.4.3'
  },
  contact: {
    name: 'Pedro Padilha Portella',
    url: 'https://www.linkedin.com/in/pedro-padilha-portella-02a67318a/'
  },
  servers: [
    { url: '/api' }
  ],
  tags: [
    { name: 'Login' },
    { name: 'Enquete' }
  ],
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': surveyPath,
    '/surveys/{surveyId}/results': surveyResultPath

  },
  schemas: {
    Account: AccountSchema,
    SignUp: SignUpSchema,
    Login: LoginParamsSchema,
    Surveys: SurveysSchema,
    Survey: SurveySchema,
    SurveyAnswer: SurveyAnswerSchema,
    AddSurvey: AddSurveyParamsSchema,
    SaveSurvey: SaveSurveyResultParamsSchema,
    SurveyResult: SurveyResultSchema,
    SurveyResultAnswer: SurveyResultAnswerSchema,
    Error: ErrorSchema
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: ApiKeyAuthSchema
    },
    badRequest,
    unauthorized,
    serverError,
    notFound,
    forbidden
  }
}