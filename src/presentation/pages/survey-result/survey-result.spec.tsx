import React from 'react'
import { SurveyResult } from '@/presentation/pages'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ApiContext } from '@/presentation/contexts'
import {
  LoadSurveyResultSpy,
  mockAccountModel,
  mockSurveyResultModel,
  SaveSurveyResultSpy
} from '@/domain/test'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { Router } from 'react-router-dom'
import { createMemoryHistory, MemoryHistory } from 'history'
import { AccountModel } from '@/domain/models'

type SutTypes = {
  loadSurveyResultSpy: LoadSurveyResultSpy
  saveSurveyResultSpy: SaveSurveyResultSpy
  history: MemoryHistory
  setCurrentAccountMock: (account: AccountModel) => void
}

type SutParams = {
  loadSurveyResultSpy?: LoadSurveyResultSpy
  saveSurveyResultSpy?: SaveSurveyResultSpy
}

const makeSut = ({
  loadSurveyResultSpy = new LoadSurveyResultSpy(),
  saveSurveyResultSpy = new SaveSurveyResultSpy()
}: SutParams = {}): SutTypes => {
  const history = createMemoryHistory({
    initialEntries: ['/', '/surveys/any_id'],
    initialIndex: 1
  })
  const setCurrentAccountMock = jest.fn()
  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountMock,
        getCurrentAccount: () => mockAccountModel()
      }}
    >
      <Router history={history}>
        <SurveyResult
          saveSurveyResult={saveSurveyResultSpy}
          loadSurveyResult={loadSurveyResultSpy}
        />
      </Router>
    </ApiContext.Provider>
  )

  return {
    loadSurveyResultSpy,
    history,
    setCurrentAccountMock,
    saveSurveyResultSpy
  }
}

describe('SurveyResult Component', () => {
  test('Should present correct initial state', async () => {
    makeSut()
    const surveyResult = screen.getByTestId('survey-result')
    expect(surveyResult.childElementCount).toBe(0)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    await waitFor(() => surveyResult)
  })

  test('Should call LoadSurveyResult', async () => {
    const { loadSurveyResultSpy } = makeSut()
    await waitFor(() => screen.getByTestId('survey-result'))
    expect(loadSurveyResultSpy.callsCount).toBe(1)
  })

  test('Should present SurveyResult data on success', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    const surveyResult = Object.assign(mockSurveyResultModel(), {
      date: new Date('2020-01-10T00:00:00')
    })
    loadSurveyResultSpy.surveyResult = surveyResult
    makeSut({ loadSurveyResultSpy })
    await waitFor(() => screen.getByTestId('survey-result'))
    expect(screen.getByTestId('day')).toHaveTextContent('10')
    expect(screen.getByTestId('month')).toHaveTextContent('jan')
    expect(screen.getByTestId('year')).toHaveTextContent('2020')
    expect(screen.getByTestId('question')).toHaveTextContent(
      surveyResult.question
    )
    expect(screen.getByTestId('answers').childElementCount).toBe(2)
    const answerWrap = screen.queryAllByTestId('answer-wrap')
    expect(answerWrap[0]).toHaveClass('active')
    expect(answerWrap[1]).not.toHaveClass('active')
    const image = screen.queryAllByTestId('image')
    expect(image[0]).toHaveAttribute('src', surveyResult.answers[0].image)
    expect(image[0]).toHaveAttribute('alt', surveyResult.answers[0].answer)
    expect(image[1]).toBeFalsy()
    const answers = screen.queryAllByTestId('answer')
    expect(answers[0]).toHaveTextContent(surveyResult.answers[0].answer)
    expect(answers[1]).toHaveTextContent(surveyResult.answers[1].answer)
    const percents = screen.queryAllByTestId('percent')
    expect(percents[0]).toHaveTextContent(`${surveyResult.answers[0].percent}%`)
    expect(percents[1]).toHaveTextContent(`${surveyResult.answers[1].percent}%`)
  })

  test('Should render error on UnexpectedError', async () => {
    const loadSurveyResult = new LoadSurveyResultSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadSurveyResult, 'load').mockRejectedValueOnce(error)
    makeSut({ loadSurveyResultSpy: loadSurveyResult })
    await waitFor(() => screen.getByTestId('survey-result'))
    expect(screen.queryByTestId('question')).not.toBeInTheDocument()
    expect(screen.getByTestId('error')).toHaveTextContent(error.message)
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  test('Should logout on AccessDeniedError', async () => {
    const loadSurveyResult = new LoadSurveyResultSpy()
    jest
      .spyOn(loadSurveyResult, 'load')
      .mockRejectedValueOnce(new AccessDeniedError())
    const { setCurrentAccountMock, history } = makeSut({
      loadSurveyResultSpy: loadSurveyResult
    })
    await waitFor(() => screen.getByTestId('survey-result'))
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname).toBe('/login')
  })

  test('Should call LoadSurveyResult on reload', async () => {
    const loadSurveyResult = new LoadSurveyResultSpy()
    jest
      .spyOn(loadSurveyResult, 'load')
      .mockRejectedValueOnce(new UnexpectedError())
    makeSut({ loadSurveyResultSpy: loadSurveyResult })
    await waitFor(() => screen.getByTestId('survey-result'))
    fireEvent.click(screen.getByTestId('reload'))
    expect(loadSurveyResult.callsCount).toBe(1)
    await waitFor(() => screen.getByTestId('survey-result'))
  })

  test('Should go to SurveyList on back button click', async () => {
    const { history } = makeSut()
    await waitFor(() => screen.getByTestId('survey-result'))
    fireEvent.click(screen.getByTestId('back-button'))
    expect(history.location.pathname).toBe('/')
  })

  test('Should not present Loading on active answer click', async () => {
    makeSut()
    await waitFor(() => screen.getByTestId('survey-result'))
    const answerWrap = screen.queryAllByTestId('answer-wrap')
    fireEvent.click(answerWrap[0])
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  test('Should call SaveSurveyResult on non active answer click', async () => {
    const { saveSurveyResultSpy, loadSurveyResultSpy } = makeSut()
    await waitFor(() => screen.getByTestId('survey-result'))
    const answerWrap = screen.queryAllByTestId('answer-wrap')
    fireEvent.click(answerWrap[1])
    expect(screen.queryByTestId('loading')).toBeInTheDocument()
    expect(saveSurveyResultSpy.params).toEqual({
      answer: loadSurveyResultSpy.surveyResult.answers[1].answer
    })

    await waitFor(() => screen.getByTestId('survey-result'))
  })

  test('Should render error on UnexpectedError', async () => {
    const saveSurveyResultSpy = new SaveSurveyResultSpy()
    const error = new UnexpectedError()
    jest.spyOn(saveSurveyResultSpy, 'save').mockRejectedValueOnce(error)
    makeSut({ saveSurveyResultSpy })
    await waitFor(() => screen.getByTestId('survey-result'))
    const answerWrap = screen.queryAllByTestId('answer-wrap')
    fireEvent.click(answerWrap[1])
    await waitFor(() => screen.getByTestId('survey-result'))
    expect(screen.queryByTestId('question')).not.toBeInTheDocument()
    expect(screen.getByTestId('error')).toHaveTextContent(error.message)
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  test('Should logout on AccessDeniedError', async () => {
    const saveSurveyResultSpy = new SaveSurveyResultSpy()
    jest
      .spyOn(saveSurveyResultSpy, 'save')
      .mockRejectedValueOnce(new AccessDeniedError())
    const { setCurrentAccountMock, history } = makeSut({
      saveSurveyResultSpy
    })
    await waitFor(() => screen.getByTestId('survey-result'))
    const answerWrap = screen.queryAllByTestId('answer-wrap')
    fireEvent.click(answerWrap[1])
    await waitFor(() => screen.getByTestId('survey-result'))
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname).toBe('/login')
  })

  test('Should present SurveyResult data on SaveSurveyResult success', async () => {
    const saveSurveyResultSpy = new SaveSurveyResultSpy()
    const surveyResult = Object.assign(mockSurveyResultModel(), {
      date: new Date('2018-02-20T00:00:00')
    })
    saveSurveyResultSpy.surveyResult = surveyResult
    makeSut({ saveSurveyResultSpy })

    await waitFor(() => screen.getByTestId('survey-result'))
    const answerWrap = screen.queryAllByTestId('answer-wrap')
    fireEvent.click(answerWrap[1])
    await waitFor(() => screen.getByTestId('survey-result'))

    expect(screen.getByTestId('day')).toHaveTextContent('20')
    expect(screen.getByTestId('month')).toHaveTextContent('fev')
    expect(screen.getByTestId('year')).toHaveTextContent('2018')
    expect(screen.getByTestId('question')).toHaveTextContent(
      surveyResult.question
    )
    expect(screen.getByTestId('answers').childElementCount).toBe(2)
    expect(answerWrap[0]).toHaveClass('active')
    expect(answerWrap[1]).not.toHaveClass('active')
    const image = screen.queryAllByTestId('image')
    expect(image[0]).toHaveAttribute('src', surveyResult.answers[0].image)
    expect(image[0]).toHaveAttribute('alt', surveyResult.answers[0].answer)
    expect(image[1]).toBeFalsy()
    const answers = screen.queryAllByTestId('answer')
    expect(answers[0]).toHaveTextContent(surveyResult.answers[0].answer)
    expect(answers[1]).toHaveTextContent(surveyResult.answers[1].answer)
    const percents = screen.queryAllByTestId('percent')
    expect(percents[0]).toHaveTextContent(`${surveyResult.answers[0].percent}%`)
    expect(percents[1]).toHaveTextContent(`${surveyResult.answers[1].percent}%`)
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  test('Should prevent multiple answer click', async () => {
    const { saveSurveyResultSpy } = makeSut()
    await waitFor(() => screen.getByTestId('survey-result'))
    const answerWrap = screen.queryAllByTestId('answer-wrap')
    fireEvent.click(answerWrap[1])
    fireEvent.click(answerWrap[1])
    await waitFor(() => screen.getByTestId('survey-result'))
    expect(saveSurveyResultSpy.callsCount).toBe(1)
  })
})
