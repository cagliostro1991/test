import vue from 'vue';
import { default as Component } from 'vue-class-component';

import { AppHeader } from '../template/app-header';
import { AppFooter } from '../template/app-footer';

import IocContainer from '../../container/IocContainer';
import SERVICES     from '../../services/SERVICES';

import User from '../../interfaces/User';
import Auth from '../../interfaces/Auth';

@Component({
  template: require('./app.html'),
  components: {
    'app-header' : AppHeader,
    'app-footer' : AppFooter,
  },
})
export default class App extends vue {
  userProvider = IocContainer.get<User>(SERVICES.USER);
  authProvider = IocContainer.get<Auth>(SERVICES.AUTH);

  mounted() {
    if (this.authProvider.isAuthenticated()) {
      this.userProvider.getUser().then(
        (response) => {
          this.$store.dispatch('setUser', response.data.user).then(() => {
            this.$store.dispatch('setAuth', true);
          });
        },
        (error) => {
          console.error(error.response.data.error);
        },
      );
    }
  }

  get auth () {
    return this.$store.state.auth;
  }

}
