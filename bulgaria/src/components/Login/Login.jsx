import { Link } from 'react-router-dom'
import { useContext, useState } from 'react'

import  AuthContext   from "../../contexts/AuthContext";
import { useForm } from "../../hooks/useForm"
import * as styles from '../Login/Login.module.css'


export default function Login() {
  const { onLoginSubmit } = useContext(AuthContext);
  const [errors, setErrors] = useState({})
  const { values, changeHandler, onSubmit } = useForm({
    email: '',
    password: ''
  }, onLoginSubmit);

  const emailValidate = () => {
    if (values.email.length == 0) {
      setErrors(state => ({
        ...state,
        email: "Email is required",
      }))
    }

   else {
      if (errors.email) {
        setErrors(state => ({ ...state, email: '' }))
      }
    }
  }

  const passwordValidate = () => {
    if (values.password.length == 0) {
      setErrors(state => ({
        ...state,
        password: "Password is required",
      }))
    }
    
    else {
      if (errors.password) {
        setErrors(state => ({ ...state, password: '' }))
      }
    }
  }


  return (
    <section className="login">
      <div className={styles.loginPage}>

        <form className={styles.form} method="POST" onSubmit={onSubmit}>
          <h2>Login</h2>
          <input
            type="text"
            name="email"
            id="email" placeholder="email"
            value={values.email}
            onChange={changeHandler}
            onBlur={emailValidate}
            className={errors.email && styles.inputError} />
          {errors.email && (
            <p className={styles.errorMessage}>{errors.email}</p>
          )}

          <input
            type="password"
            name="password"
            id="password"
            placeholder="password"
            value={values.password}
            onChange={changeHandler}
            onBlur={passwordValidate}
            className={errors.password && styles.inputError} />
          {errors.password && (
            <p className={styles.errorMessage}>{errors.password}</p>
          )}

          <button type="submit" disabled={Object.values(errors).some(x => x)}>login</button>
          <p className={styles.message}>
            Not registered? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </section>
  )
}