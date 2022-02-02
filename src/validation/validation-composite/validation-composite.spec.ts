import { FieldValidationSpy } from '../validators/test'
import { ValidationComposite } from './validation-composite'

describe('ValidationComposite', () => {
  test('Should return error if any validation fails', () => {
    const fiedlValidationSpy = new FieldValidationSpy('any_field')
    fiedlValidationSpy.error = new Error('first_error_message')
    const fiedlValidationSpy2 = new FieldValidationSpy('any_field')
    fiedlValidationSpy2.error = new Error('second_error_message')

    const sut = new ValidationComposite([
      fiedlValidationSpy,
      fiedlValidationSpy2
    ])
    const error = sut.validate('any_field', 'any_value')

    expect(error).toBe('first_error_message')
  })
})
