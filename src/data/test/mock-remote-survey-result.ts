import { RemoteLoadSurveyList, RemoteLoadSurveyResult } from '../usecases'
import faker from 'faker'

export const mockRemoteSurveyResultModel =
  (): RemoteLoadSurveyResult.Model => ({
    question: faker.random.words(10),
    date: faker.date.recent().toISOString(),
    answers: [
      {
        image: faker.internet.url(),
        answer: faker.random.word(),
        count: faker.datatype.number(),
        percent: faker.datatype.number(),
        isCurrentAccountAnswer: faker.datatype.boolean()
      },
      {
        answer: faker.random.word(),
        count: faker.datatype.number(),
        percent: faker.datatype.number(),
        isCurrentAccountAnswer: faker.datatype.boolean()
      }
    ]
  })
