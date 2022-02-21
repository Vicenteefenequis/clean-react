import { InvalidFieldError } from '@/validation/errors'
import { FieldValidation } from '@/validation/protocols/field-validation'

export class CompareFieldsValidation implements FieldValidation {
  constructor(
    readonly fieldName: string,
    private readonly fieldToCompare: string
  ) {}

  validate(input: object): Error {
    return input[this.fieldName] !== input[this.fieldToCompare]
      ? new InvalidFieldError()
      : null
  }
}
