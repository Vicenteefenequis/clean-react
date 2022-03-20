import React from 'react'
import { SurveyResult } from '@/presentation/pages'
import { useParams } from 'react-router-dom'
import { makeRemoteLoadSurveyResult } from '@/main/factories/usecases'

export const makeSurveyResult: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  return <SurveyResult loadSurveyResult={makeRemoteLoadSurveyResult(id)} />
}
