import qs from 'qs';

export function isLoggedIn() {
  const opsviewToken = localStorage.getItem('opsview_token');
  const opsviewUsername = localStorage.getItem('opsview_username');

  return opsviewToken && opsviewUsername;
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

export function requestOpsview() {}
