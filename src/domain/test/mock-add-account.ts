import { AddAccount } from '@/domain/usecases'
import faker from 'faker'
import { mockAccountModel } from './mock-account'

export const mockAddAccountParams = (): AddAccount.Params => {
  const password = faker.internet.password()
  return {
    email: faker.internet.email(),
    password: password,
    name: faker.name.findName(),
    passwordConfirmation: password
  }
}

export const mockAddAccountModel = (): AddAccount.Model => mockAccountModel()
