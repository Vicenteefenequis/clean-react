export interface FieldValidation {
  fieldName: string
  validate(value: String): Error
}
