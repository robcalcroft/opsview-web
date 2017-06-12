export function isLoggedIn() {
  const opsviewToken = localStorage.getItem('opsview_token');
  const opsviewUsername = localStorage.getItem('opsview_username');

  return opsviewToken && opsviewUsername;
}

export const a = 1;
