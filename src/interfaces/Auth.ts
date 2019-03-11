export default interface Auth {
  http;
  token();
  isAuthenticated();
  authenticated(token: string);
  logout();
  login(email: string, password: string);
}
