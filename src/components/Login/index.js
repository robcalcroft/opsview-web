import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import qs from 'qs';
import { login, addQueryParameter } from '../../constants/utilities';
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
          addQueryParameter(this.props.location.search, {
            error: error.message,
          });
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
    const { message, error } = qs.parse(
      this.props.location.search.replace(/^\?/, ''),
      { ignoreQueryPrefix: true },
    );

    return !loginSuccess ? (
      <div className={styles.container}>
        <form className={styles.loginForm} onSubmit={this.submitLogin}>
          <b className={styles.title}>Log in to Opsview Monitor</b>
          {message && <div className={styles.message}>{decodeURIComponent(message)}</div>}
          {error && <div className={`${styles.message} ${styles['message--error']}`}>{decodeURIComponent(error)}</div>}
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

Login.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

export default Login;
