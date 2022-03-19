import React, { useContext, useEffect, useState } from 'react'
import Styles from './signup-styles.scss'
import {
  Footer,
  Input,
  LoginHeader,
  FormStatus,
  SubmitButton
} from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'
import { AddAccount } from '@/domain/usecases'
import { Link, useHistory } from 'react-router-dom'
import { ApiContext } from '@/presentation/contexts'

type Props = {
  validation: Validation
  addAccount: AddAccount
}

const SignUp: React.FC<Props> = ({ validation, addAccount }: Props) => {
  const { setCurrentAccount } = useContext(ApiContext)

  const history = useHistory()
  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    nameError: '',
    emailError: '',
    passwordError: '',
    passwordConfirmationError: '',
    mainError: ''
  })

  useEffect(() => {
    validate('email')
  }, [state.email])

  useEffect(() => {
    validate('password')
  }, [state.password])

  useEffect(() => {
    validate('name')
  }, [state.name])

  useEffect(() => {
    validate('passwordConfirmation')
  }, [state.passwordConfirmation])

  const validate = (field: string): void => {
    const { email, name, password, passwordConfirmation } = state
    const formData = { email, name, password, passwordConfirmation }
    setState(old => ({
      ...old,
      [`${field}Error`]: validation.validate(field, formData)
    }))

    setState(old => ({
      ...old,
      isFormInvalid:
        !!old.nameError ||
        !!old.passwordConfirmationError ||
        !!old.emailError ||
        !!old.passwordError
    }))
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()

    try {
      if (state.isLoading || state.isFormInvalid) {
        return
      }

      setState(old => ({ ...old, isLoading: true }))
      const account = await addAccount.add({
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation
      })

      setCurrentAccount(account)
      history.replace('/')
    } catch (error) {
      setState(old => ({ ...old, mainError: error.message, isLoading: false }))
    }
  }

  return (
    <div className={Styles.signupWrap}>
      <LoginHeader />
      <Context.Provider value={{ state, setState }}>
        <form
          data-testid="form"
          className={Styles.form}
          onSubmit={handleSubmit}
        >
          <h2>Criar Conta</h2>

          <Input type="text" name="name" placeholder="Digite seu nome" />
          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input
            type="password"
            name="password"
            placeholder="Digite sua senha"
          />
          <Input
            type="password"
            name="passwordConfirmation"
            placeholder="Repita sua senha"
          />

          <SubmitButton text="Cadastrar" />
          <Link
            data-testid="login-link"
            replace
            to="/login"
            className={Styles.link}
          >
            Voltar Para Login
          </Link>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default SignUp
