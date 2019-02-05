import vue from 'vue';
import { default as Component } from 'vue-class-component';

import { AppSidebar }               from '../../template/app-sidebar';
import { DashboradNavigationBlock } from '../../template/dashborad-navigation-block';

import IocContainer from '../../../container/IocContainer';
import SERVICES     from '../../../services/SERVICES';

import Course from '../../../interfaces/Course';

@Component({
  template: require('./course-page.html'),
  components: {
    'app-sidebar' : AppSidebar,
    'dashborad-navigation-block' : DashboradNavigationBlock,
  },
})
export class CoursePage extends vue {

  courseData = [];
  courseProvider = IocContainer.get<Course>(SERVICES.COURSE);

  mounted() {
    this.courseProvider.getCourses().then(
      (response) => {
        this.courseData = response;
        console.log(response);
      },
      (error) => {
        console.error(error);
      },
    );
  }
}
