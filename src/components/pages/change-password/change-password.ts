import vue from 'vue';
import { default as Component } from 'vue-class-component';

import { AppSidebar }               from '../../template/app-sidebar';
import { DashboradNavigationBlock } from '../../template/dashborad-navigation-block';

import IocContainer from '../../../container/IocContainer';
import SERVICES     from '../../../services/SERVICES';

import User from '../../../interfaces/User';

@Component({
  template: require('./change-password.html'),
  components: {
    'app-sidebar' : AppSidebar,
    'dashborad-navigation-block' : DashboradNavigationBlock,
  },
})
export class ChangePassword extends vue {
  errors = [];
  success = false;
  formPassChange = {
    password : '',
    passwordConformation : '',
  };

  userProvider = IocContainer.get<User>(SERVICES.USER);

  get same () {
    return this.formPassChange.passwordConformation === this.formPassChange.password;
  }

  updatePass() {
    if (this.same) {
      this.userProvider.setUserPass(this.formPassChange.password).then(
        (response) => {
          this.errors = [];
          this.success = true;
          setTimeout(() => {
            this.success = false;
          }, 2000);
        },
        (error) => {
          this.success = false;
          this.errors = error.response.data.errors;
          console.error(error.response.data.errors);
        },
      );
    }
  }
}
