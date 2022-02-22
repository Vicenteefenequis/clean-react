import faker from 'faker'
import * as Helper from '../support/http-mocks'

export const mockUnexpectedError = (): void =>
  Helper.mockUnexpectedError(/signup/, 'POST')

export const mockEmailInUseError = (): void =>
  Helper.mockEmailInUseError(/signup/)

export const mockInvalidData = (): void =>
  Helper.mockOk(/signup/, 'POST', { invalid: faker.datatype.uuid() })
