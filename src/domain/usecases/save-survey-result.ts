import { SurveyResultModel } from '@/domain/models'

export interface LoadSurveyResult {
  save(params: SaveSurveyResult.Params): Promise<SaveSurveyResult.Model>
}

export namespace SaveSurveyResult {
  export type Params = {
    answer: string
  }
  export type Model = SurveyResultModel
}
