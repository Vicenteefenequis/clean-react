import React from 'react'
import { SurveyResult } from '@/presentation/pages'
import { useParams } from 'react-router-dom'
import {
  makeRemoteLoadSurveyResult,
  makeRemoteSaveSurveyResult
} from '@/main/factories/usecases'

export const makeSurveyResult: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  return (
    <SurveyResult
      saveSurveyResult={makeRemoteSaveSurveyResult(id)}
      loadSurveyResult={makeRemoteLoadSurveyResult(id)}
    />
  )
}
