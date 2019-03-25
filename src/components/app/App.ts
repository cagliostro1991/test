import vue from 'vue';
import { default as Component } from 'vue-class-component';
import { Watch }                from 'vue-property-decorator';

import IocContainer from '../../container/IocContainer';
import SERVICES     from '../../services/SERVICES';

import User   from '../../interfaces/User';

import { AppHeader } from '../template/app-header';
import { AppFooter } from '../template/app-footer';
import Auth from '../../interfaces/Auth';

@Component({
  template: require('./app.html'),
  components: {
    'app-header' : AppHeader,
    'app-footer' : AppFooter,
  },
})
export default class App extends vue {

  authProvider   = IocContainer.get<Auth>(SERVICES.AUTH);

  mounted() {
    if (this.authProvider.isAuthenticated()) {
      this.$store.dispatch('loadUser').then(
        () => {
          this.$store.dispatch('loadCourse');
        },
      );
    }
  }

  get auth () {
    return this.$store.state.auth;
  }
}
