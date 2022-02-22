import * as FormHelper from '../support/form-helper'
import {
  mockInvalidCredentialsError,
  mockInvalidData,
  mockOk,
  mockUnexpectedError
} from './login-mocks'
import faker from 'faker'

const simulateValidSubmit = (): void => {
  cy.getByTestId('email').focus().type(faker.internet.email())
  cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
  cy.getByTestId('submit').click()
}

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login')
  })
  it('Should load with correct initial state', () => {
    cy.getByTestId('email').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('email', 'Campo obrigatorio')
    cy.getByTestId('password').should('have.attr', 'readOnly')
    FormHelper.testInputStatus('password', 'Campo obrigatorio')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('email').focus().type(faker.random.word())
    FormHelper.testInputStatus('email', 'valor invalido')
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    FormHelper.testInputStatus('password', 'valor invalido')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present valid state if form is valid', () => {
    cy.getByTestId('email').focus().type(faker.internet.email())
    FormHelper.testInputStatus('email')

    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    FormHelper.testInputStatus('password')

    cy.getByTestId('submit').should('not.have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present InvalidCredentialsError on 401', () => {
    mockInvalidCredentialsError()
    simulateValidSubmit()
    FormHelper.testMainError('Credenciais invalidas')
    FormHelper.testUrl('/login')
  })

  it('Should present UnexpectedError on 400', () => {
    mockUnexpectedError()
    simulateValidSubmit()
    FormHelper.testMainError(
      'Algo de errado aconteceu. Tente novamente em breve'
    )
    FormHelper.testUrl('/login')
  })

  it('Should present UnexpectedError if invalid data is returned', () => {
    mockInvalidData()
    simulateValidSubmit()
    FormHelper.testMainError(
      'Algo de errado aconteceu. Tente novamente em breve'
    )

    FormHelper.testUrl('/login')
  })

  // it('Should present save accessToken if valid credentials are provided', () => {
  //   mockOk()
  //simulateValidSubmit()
  //   cy.getByTestId('error-wrap').should('not.have.descendants')
  //    FormHelper.testUrl('/')
  //   FormHelper.testLocalStorageItem('accessToken')
  //
  // })

  it('Should prevent multiple submits', () => {
    mockOk()
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').dblclick()
    FormHelper.testHttpCallsCount(1)
  })

  it('Should not call submit if form is invalid', () => {
    mockOk()
    cy.getByTestId('email').focus().type(faker.internet.email()).type('{enter}')
    FormHelper.testHttpCallsCount(0)
  })
})
