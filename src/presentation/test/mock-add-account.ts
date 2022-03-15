import { mockAddAccountModel } from '@/domain/test'
import { AddAccount, Authentication } from '@/domain/usecases'

export class AddAccountSpy implements AddAccount {
  account = mockAddAccountModel()
  params: Authentication.Params
  callsCount = 0

  async add(params: AddAccount.Params): Promise<AddAccount.Model> {
    this.params = params
    this.callsCount++
    return this.account
  }
}
