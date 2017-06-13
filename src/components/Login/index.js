import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { requestCore } from '../../constants/utilities';

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

    requestCore({
      method: 'POST',
      url: '/rest/login',
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      done: ({ token }) => {
        localStorage.setItem('opsview_username', username);
        localStorage.setItem('opsview_token', token);
        this.setState({
          loginSuccess: true,
        });
      },
      fail: (response) => {
        console.log('failed', response);
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
        <div>OPSVIEW</div>
        <form onSubmit={this.submitLogin}>
          <input onChange={this.fieldChange} name="username" />
          <input onChange={this.fieldChange} name="password" type="password" />
          <button type="submit">Log In</button>
        </form>
      </div>
    ) : (
      <Redirect to="/hosts" />
    );
  }
}

export default Login;
