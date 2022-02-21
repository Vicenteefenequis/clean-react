import { RequiredFieldError } from '@/validation/errors'
import { RequiredFieldValidation } from './required-field-validation'
import faker from 'faker'

const makeSut = (fieldName: string): RequiredFieldValidation =>
  new RequiredFieldValidation(fieldName)

describe('RequiredFieldValidation', () => {
  test('Should return error if field is empty', () => {
    const fieldName = faker.database.column()
    const sut = makeSut(fieldName)
    const error = sut.validate({ [fieldName]: '' })
    expect(error).toEqual(new RequiredFieldError())
  })

  test('Should return falsy if field is not empty', () => {
    const fieldName = faker.database.column()
    const sut = makeSut(fieldName)
    const error = sut.validate({ [fieldName]: faker.random.word() })
    expect(error).toBeFalsy()
  })
})
