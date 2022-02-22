import faker from 'faker'
import * as FormHelper from '../support/form-helper'
import {
  mockEmailInUseError,
  mockUnexpectedError
} from '../support/signup-mocks'

const simulateValidSubmit = (): void => {
  cy.getByTestId('name').focus().type(faker.name.findName())
  cy.getByTestId('email').focus().type(faker.internet.email())
  const password = faker.random.alphaNumeric(5)
  cy.getByTestId('password').focus().type(password)
  cy.getByTestId('passwordConfirmation').focus().type(password)
  cy.getByTestId('submit').click()
}

describe('Signup', () => {
  beforeEach(() => {
    cy.visit('signup')
  })
  it('Should load with correct initial state', () => {
    cy.getByTestId('name').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('name', 'Campo obrigatorio')
    cy.getByTestId('email').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('email', 'Campo obrigatorio')
    cy.getByTestId('password').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('password', 'Campo obrigatorio')
    cy.getByTestId('passwordConfirmation').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('passwordConfirmation', 'Campo obrigatorio')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('name').focus().type(faker.random.alphaNumeric(3))
    FormHelper.testInputStatus('name', 'valor invalido')
    cy.getByTestId('email').focus().type(faker.random.word())
    FormHelper.testInputStatus('email', 'valor invalido')
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    FormHelper.testInputStatus('password', 'valor invalido')
    cy.getByTestId('passwordConfirmation')
      .focus()
      .type(faker.random.alphaNumeric(3))
    FormHelper.testInputStatus('passwordConfirmation', 'valor invalido')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present valid state if form is valid', () => {
    cy.getByTestId('name').focus().type(faker.name.findName())
    FormHelper.testInputStatus('name')

    cy.getByTestId('email').focus().type(faker.internet.email())
    FormHelper.testInputStatus('email')

    const password = faker.random.alphaNumeric(5)

    cy.getByTestId('password').focus().type(password)
    FormHelper.testInputStatus('password')

    cy.getByTestId('passwordConfirmation').focus().type(password)
    FormHelper.testInputStatus('passwordConfirmation')

    cy.getByTestId('submit').should('not.have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present EmailInUseError on 403', () => {
    mockEmailInUseError()
    simulateValidSubmit()
    FormHelper.testMainError('Esse e-mail ja esta em uso')
    FormHelper.testUrl('/signup')
  })

  it('Should present UnexpectedError on 400', () => {
    mockUnexpectedError()
    simulateValidSubmit()
    FormHelper.testMainError(
      'Algo de errado aconteceu. Tente novamente em breve'
    )
    FormHelper.testUrl('/signup')
  })
})
