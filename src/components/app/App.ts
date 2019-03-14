import vue from 'vue';
import { default as Component } from 'vue-class-component';

import { AppHeader } from '../template/app-header';
import { AppFooter } from '../template/app-footer';

@Component({
  template: require('./app.html'),
  components: {
    'app-header' : AppHeader,
    'app-footer' : AppFooter,
  },
})
export default class App extends vue {

  mounted() {
    this.$store.dispatch('loadUser').then(
      () => {
        this.$store.dispatch('loadCourse');
      },
    );
  }

  get auth () {
    return this.$store.state.auth;
  }

}
