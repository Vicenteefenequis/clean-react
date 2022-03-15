import { Authentication } from '../usecases'
import { mockAccountModel } from './mock-account'

export const mockAuthenticationModel = (): Authentication.Model =>
  mockAccountModel()
