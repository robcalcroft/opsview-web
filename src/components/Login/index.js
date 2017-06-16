import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { login } from '../../constants/utilities';
import { DEFAULT_ROUTE } from '../../constants/globals';

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
      <div>
        <form onSubmit={this.submitLogin}>
          <input onChange={this.fieldChange} name="username" />
          <input onChange={this.fieldChange} name="password" type="password" />
          <button type="submit">Log In</button>
        </form>
      </div>
    ) : (
      <Redirect to={DEFAULT_ROUTE} />
    );
  }
}

export default Login;
