import * as Helper from '../support/http-mocks'

export const mockUnexpectedError = (): void =>
  Helper.mockUnexpectedError(/signup/, 'POST')

export const mockEmailInUseError = (): void =>
  Helper.mockEmailInUseError(/signup/)
