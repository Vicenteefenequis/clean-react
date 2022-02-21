import React from 'react'
import { SignUp } from '@/presentation/pages'
import { makeRemoteAuthentication } from '../../usecases/authentication/remote-authentication-factory'
import { makeLocalSaveAccessToken } from '../../usecases/save-access-token/local-save-access-token-fatory'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeRemoteAddAccount } from '../../usecases/add-account/remote-add-account-factory'

export const makeSignUp: React.FC = () => {
  return (
    <SignUp
      addAccount={makeRemoteAddAccount()}
      validation={makeSignUpValidation()}
      saveAccessToken={makeLocalSaveAccessToken()}
    />
  )
}
