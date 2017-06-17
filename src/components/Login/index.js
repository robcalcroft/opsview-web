import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { login } from '../../constants/utilities';
import { DEFAULT_ROUTE } from '../../constants/globals';
import Button from '../Button';
import styles from './Login.scss';

class Login extends Component {
  constructor(props) {
    super(props);

    this.submitLogin = this.submitLogin.bind(this);
    this.fieldChange = this.fieldChange.bind(this);

    this.state = {
      username: '',
      password: '',
      loginSuccess: false,
    };
  }

  submitLogin(event) {
    event.preventDefault();

    const { username, password } = this.state;

    login({
      username,
      password,
      callback: (error) => {
        if (!error) {
          this.setState({
            loginSuccess: true,
          });
        } else {
          alert(error.message);
        }
      },
    });
  }

  fieldChange({ target: { value, name } }) {
    this.setState({
      [name]: value,
    });
  }

  render() {
    const { loginSuccess } = this.state;

    return !loginSuccess ? (
      <div className={styles.container}>
        <form className={styles.loginForm} onSubmit={this.submitLogin}>
          <b className={styles.title}>Log into Opsview Monitor</b>
          <input
            placeholder="Username"
            className={styles.field}
            onChange={this.fieldChange}
            name="username"
          />
          <input
            placeholder="Password"
            className={styles.field}
            onChange={this.fieldChange}
            name="password"
            type="password"
          />
          <div>
            <input id="rememberUsername" type="checkbox" />
            <label htmlFor="rememberUsername">Remember my username</label>
          </div>
          <Button type="submit">Log In</Button>
        </form>
      </div>
    ) : (
      <Redirect to={DEFAULT_ROUTE} />
    );
  }
}

export default Login;
