import { InvalidFieldError } from '@/validation/errors'
import { MinLengthValidation } from './min-length-validation'
import faker from 'faker'

const makeSut = (fieldName: string): MinLengthValidation =>
  new MinLengthValidation(fieldName, 5)

describe('MinLengthValidation', () => {
  test('Should return error if value is invalid', () => {
    const fieldName = faker.database.column()
    const sut = makeSut(fieldName)
    const error = sut.validate({ [fieldName]: faker.random.alphaNumeric(4) })

    expect(error).toEqual(new InvalidFieldError())
  })

  test('Should return falsy if value is valid', () => {
    const fieldName = faker.database.column()
    const sut = makeSut(fieldName)
    const error = sut.validate({ [fieldName]: faker.random.alphaNumeric(5) })

    expect(error).toBeFalsy()
  })

  test('Should return falsy if value is valid', () => {
    const sut = makeSut('any_field')
    const error = sut.validate({
      invalid_field: faker.random.alphaNumeric(5)
    })

    expect(error).toBeFalsy()
  })
})
