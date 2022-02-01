import { FieldValidation } from '@/validation/protocols/field-validation'
import { RequiredFieldError } from '@/validation/errors'

export class RequiredFieldValidation implements FieldValidation {
  constructor (readonly fieldName: string) {}
  validate (value: String): Error {
    return value ? null : new RequiredFieldError()
  }
}
