import qs from 'qs';

export function getCredentials() {
  return {
    username: localStorage.getItem('opsview_token'),
    token: localStorage.getItem('opsview_username'),
  };
}

export function isLoggedIn() {
  const { username, token } = getCredentials();
  return username && token;
}

export function decodeJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return 'Could not decode response';
  }
}

export function requestCore({
  method = 'GET',
  url = false,
  headers = {},
  body = '',
  query = {},
  done = () => {},
  fail = () => {},
  always = () => {},
}) {
  if (!url) {
    throw new Error('requestCore needs a URL');
  }

  const xhr = new XMLHttpRequest();

  xhr.open(method, `${url}?${qs.stringify(query)}`, true);

  Object.keys(headers).forEach(header => xhr.setRequestHeader(header, headers[header]));

  xhr.onload = () => {
    const successRegex = /^2/;

    always(decodeJSON(xhr.response), xhr);

    if (successRegex.test(xhr.status)) {
      done(decodeJSON(xhr.response), xhr);
    } else {
      fail(decodeJSON(xhr.response), xhr);
    }
  };
  xhr.onerror = () => {
    always(decodeJSON(xhr.response), xhr);
    fail(decodeJSON(xhr.response), xhr);
  };
  xhr.ontimeout = () => {
    const timeoutResponse = {
      message: 'Request timed out, try again',
    };

    always(timeoutResponse, xhr);
    fail(timeoutResponse, xhr);
  };

  if (method === 'GET') {
    xhr.send();
  } else {
    xhr.send(body);
  }

  return xhr;
}

export function login({ username = '', password = '', callback = () => {} }) {
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
      callback(false);
    },
    fail: response => callback(response),
  });
}

export function requestOpsview(options) {
  const { username, token } = getCredentials();
  // Hardcoded url
  const opsviewUrl = '';

  requestCore({
    ...options,
    url: `${opsviewUrl}${options.route}`,
    headers: {
      'content-type': 'application/json',
      'x-opsview-token': token,
      'x-opsview-username': username,
      ...options.headers,
    },
    fail: (response) => {
      if (
        response.message === 'Token invalid' ||
        response.message === 'Token has expired'
      ) {
        // If the token is not working then we log the user out
        localStorage.clear();
        window.location.reload();
      } else {
        if (options.always) {
          options.always(response);
        }

        if (options.fail) {
          options.fail(response);
        }
      }
    },
  });
}
