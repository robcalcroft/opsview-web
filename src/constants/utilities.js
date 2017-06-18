import qs from 'qs';

export function getCredentials() {
  return {
    username: localStorage.getItem('opsview_username'),
    token: localStorage.getItem('opsview_token'),
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
    return {
      message: jsonString,
    };
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

export function logout() {
  localStorage.clear();
  window.location.reload();
}

export function requestOpsview(options) {
  const { username, token } = getCredentials();
  // Hardcoded url
  const opsviewUrl = '';

  return requestCore({
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

export function getStateColour(state) {
  const colours = {
    critical: 'red',
    down: 'red',
    ok: 'green',
    up: 'green',
    warning: 'yellow',
    unknown: 'purple',
    unreachable: 'purple',
  };
  return colours[state];
}

export function addQueryParameter(queryString = '', newQueryParameter = {}) {
  const hash = window.location.hash;
  const query = qs.parse(queryString.replace(/^\?/, ''), { ignoreQueryPrefix: true });
  const newQuery = {
    ...query,
    ...newQueryParameter,
  };
  let newHash = hash.replace(queryString, '');
  newHash = newHash.replace(/^\?/, '');
  newHash += `?${qs.stringify(newQuery)}`;

  window.location.hash = newHash;
}

export function removeQueryParameter(queryString, paramToRemove) {
  const hash = window.location.hash;
  const query = qs.parse(queryString.replace(/^\?/, ''), { ignoreQueryPrefix: true });
  if (typeof paramToRemove === 'string') {
    delete query[paramToRemove];
  } else {
    paramToRemove.forEach(param => delete query[param]);
  }

  let newHash = hash.replace(queryString, '');
  newHash = newHash.replace(/^\?/, '');
  newHash += `?${qs.stringify(query)}`;

  window.location.hash = newHash;
}
