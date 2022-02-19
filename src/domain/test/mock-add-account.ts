import { AddAccountParams } from '@/domain/usecases'
import faker from 'faker'

export const mockAddAccountParams = (): AddAccountParams => {
  const password = faker.internet.password()
  return {
    email: faker.internet.email(),
    password: password,
    name: faker.name.findName(),
    passwordConfirmation: password
  }
}
