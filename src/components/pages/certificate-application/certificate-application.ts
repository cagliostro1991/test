import vue from 'vue';
import { default as Component } from 'vue-class-component';

import { AppSidebar }               from '../../template/app-sidebar';
import { DashboradNavigationBlock } from '../../template/dashborad-navigation-block';

@Component({
  template: require('./certificate-application.html'),
  components: {
    'app-sidebar' : AppSidebar,
    'dashborad-navigation-block' : DashboradNavigationBlock,
  },
})
export class CertificateApplication extends vue {

}
