import vue from 'vue';
import { default as Component } from 'vue-class-component';

import IocContainer from '../../../container/IocContainer';
import SERVICES     from '../../../services/SERVICES';

import User from '../../../interfaces/User';
import Auth from '../../../interfaces/Auth';

@Component({
  template: require('./login-page.html'),
})
export class LoginPage extends vue {
  email = '';
  password = '';
  error = '';
  user = IocContainer.get<User>(SERVICES.USER);
  auth = IocContainer.get<Auth>(SERVICES.AUTH);

  mounted() {
    if (this.auth.isAuthenticated()) {
      this.$router.push({ name: 'course' });
    }
  }

  login() {
    this.auth.login(this.email, this.password).then(
      (response) => {
        this.error = '';
        this.auth.authenticated(response.data.token);
        this.user.getUser().then(
          (response) => {
            this.$store.dispatch('setUser', response.data.user);
            this.$router.push({ name: 'course' });
          },
          (error) => {
            this.errorReport(error);
          },
        );
      },
      (error) => {
        this.errorReport(error);
      },
    );
  }

  errorReport(error) {
    this.error = error.response.data.error;
    console.error(error.response.data.error);
  }
}
