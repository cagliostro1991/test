import vue from 'vue';
import { default as Component } from 'vue-class-component';

import { AppSidebar }               from '../../template/app-sidebar';
import { DashboradNavigationBlock } from '../../template/dashborad-navigation-block';

import IocContainer from '../../../container/IocContainer';
import SERVICES     from '../../../services/SERVICES';

import User from '../../../interfaces/User';

@Component({
  template: require('./profile-page.html'),
  components: {
    'app-sidebar' : AppSidebar,
    'dashborad-navigation-block' : DashboradNavigationBlock,
  },
})
export class ProfilePage extends vue {
  errors = [];
  success = false;
  formUserData = {
    name : '',
    last_name : '',
    phone : '',
    email : '',
    gender : '',
    birthday : '',
    address : '',
    city : '',
    country : '',
    state : '',
    zip : '',
  };

  userProvider = IocContainer.get<User>(SERVICES.USER);

  mounted() {
    this.formUserData = {
      name : this.user.name,
      last_name : this.user.last_name,
      phone : this.user.phone,
      email : this.user.email,
      gender : this.user.gender,
      birthday : this.user.birthday,
      address : this.user.address,
      city : this.user.city,
      country : this.user.country,
      state : this.user.state,
      zip : this.user.zip,
    };
  }

  get user() {
    return this.$store.getters.user;
  }

  updateProfile() {
    this.userProvider.setUser(this.formUserData).then(
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
