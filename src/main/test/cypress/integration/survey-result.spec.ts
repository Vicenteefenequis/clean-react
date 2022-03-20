import * as Helper from '../utils/helpers'
import * as Http from '../utils/http-mocks'

const path = /surveys/

export const mockUnexpectedError = (): void => Http.mockServerError(path, 'GET')
export const mockOk = (): void => Http.mockOk(path, 'GET', 'fx:survey-result')

describe('SurveyResult', () => {
  beforeEach(() => {
    cy.fixture('account').then(account => {
      Helper.setLocalStorageItem('account', account)
    })
  })

  it('Should present error on UnexpectedError', () => {
    mockUnexpectedError()
    cy.visit('/surveys/any_id')
    cy.getByTestId('error').should(
      'contain.text',
      'Algo de errado aconteceu. Tente novamente em breve'
    )
  })

  it('Should reload on button click', () => {
    mockUnexpectedError()
    cy.visit('/surveys/any_id')

    cy.getByTestId('error').should(
      'contain.text',
      'Algo de errado aconteceu. Tente novamente em breve'
    )
    mockOk()
    cy.getByTestId('reload').click()
    cy.getByTestId('question').should('exist')
  })
})
