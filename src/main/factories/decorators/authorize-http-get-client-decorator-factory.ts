import { makeLocalStorageAdapter } from '@/main/cache'
import { AuthorizeHttpGetClientDecorator } from '@/main/decorators'
import { makeAxiosHttpClient } from '@/main/factories/http'
import { HttpGetClient } from '@/data/protocols/http'

export const makeAuthorizeHttpGetClientDecorator = (): HttpGetClient =>
  new AuthorizeHttpGetClientDecorator(
    makeLocalStorageAdapter(),
    makeAxiosHttpClient()
  )
