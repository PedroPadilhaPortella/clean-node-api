import { AddAccountRepository } from "@/data/protocols/add-account-repository.interface"
import { AddSurveyRepository } from "@/data/protocols/add-survey-repository.interface"
import { Decrypter } from "@/data/protocols/decrypter.interface"
import { Encrypter } from '@/data/protocols/encrypter.interface'
import { HashComparer } from '@/data/protocols/hash-comparer.interface'
import { Hasher } from "@/data/protocols/hasher.interface"
import { LoadAccountByEmailRepository } from "@/data/protocols/load-account-by-email-repository.interface"
import { LoadAccountByTokenRepository } from "@/data/protocols/load-account-by-token-repository.interface"
import { LoadSurveyByIdRepository } from "@/data/protocols/load-survey-by-id-repository.interface"
import { LoadSurveysRepository } from "@/data/protocols/load-surveys-repository.interface"
import { LogErrorRepository } from "@/data/protocols/log-error-repository.interface"
import { SaveSurveyResultRepository } from "@/data/protocols/save-survey-result.repository"
import { UpdateAccessTokenRepository } from "@/data/protocols/update-access-token-repository.interface"
import { AccountModel } from "@/domain/models/account.model"
import { SurveyResultModel } from "@/domain/models/survey-result"
import { SurveyModel } from "@/domain/models/survey.model"
import { AddAccount, AddAccountParams } from "@/domain/usecases/add-account.interface"
import { AddSurvey, AddSurveyParams } from "@/domain/usecases/add-survey.interface"
import { Authentication, AuthenticationParams } from "@/domain/usecases/authentication.interface"
import { LoadAccountByToken } from "@/domain/usecases/load-account-by-token.interface"
import { LoadSurveyById } from "@/domain/usecases/load-survey-by-id.interface"
import { LoadSurveys } from "@/domain/usecases/load-surveys.interface"
import { SaveSurveyResult, SaveSurveyResultParams } from "@/domain/usecases/save-survey-result.interface"
import { InternalServerError } from "@/presentation/errors"
import { Controller, EmailValidator, HttpRequest, HttpResponse, Validation } from "@/presentation/protocols"
import { ObjectId } from 'mongodb'
import { ACCOUNT, SURVEY, SURVEYS, SURVEY_RESULT } from "./constants.mock"

/**
 * Classe Dedicada à criar mockFactories para diversas implementações de classes
 */

/* Mock Repositories */
export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return await Promise.resolve({ ...account, id: '1', password: 'hash' })
    }
  }
  return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmail = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel | null> {
      return ACCOUNT
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return ACCOUNT
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (account: AddSurveyParams): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateToken (id: ObjectId | string, token: string): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return SURVEYS
    }
  }
  return new LoadSurveysRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel | null> {
      return SURVEY
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return SURVEY_RESULT
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

export const createLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stackError: string): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new LogErrorRepositoryStub()
}

/* Data Usecases */
export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel | null> {
      return await Promise.resolve(ACCOUNT)
    }
  }
  return new AddAccountStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (token: string, role?: string | undefined): Promise<AccountModel | null> {
      return ACCOUNT
    }
  }
  return new LoadAccountByTokenStub()
}

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async authenticate (authentication: AuthenticationParams): Promise<string> {
      return 'login_token'
    }
  }
  return new AuthenticationStub()
}

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new AddSurveyStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await Promise.resolve(SURVEYS)
    }
  }
  return new LoadSurveysStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return SURVEY
    }
  }
  return new LoadSurveyByIdStub()
}

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return SURVEY_RESULT
    }
  }
  return new SaveSurveyResultStub()
}

/* Adapter */
export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('hash')
    }
  }
  return new HasherStub()
}

export const mockHashCompare = (): HashComparer => {
  class HashCompareStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return true
    }
  }
  return new HashCompareStub()
}

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return 'token'
    }
  }
  return new EncrypterStub()
}

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (token: string): Promise<string> {
      return 'decrypted_token'
    }
  }
  return new DecrypterStub()
}

export const mockEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (field: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

/* Controllers */
export const mockController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = { body: {}, statusCode: 200 }
      return await Promise.resolve(httpResponse)
    }
  }
  return new ControllerStub()
}

/* Errors */
export const throwError = (): never => {
  throw new Error()
}

export const throwInternalServerError = (): never => {
  throw new InternalServerError('Error')
}