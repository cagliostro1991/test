import vue from 'vue';
import { default as Component } from 'vue-class-component';

import { AppSidebar }               from '../../template/app-sidebar';
import { DashboradNavigationBlock } from '../../template/dashborad-navigation-block';

import IocContainer from '../../../container/IocContainer';
import SERVICES     from '../../../services/SERVICES';

import Course from '../../../interfaces/Course';
import Unit   from '../../../interfaces/Unit';

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
  unitProvider   = IocContainer.get<Unit>(SERVICES.UNIT);

  mounted() {
    this.courseProvider.getCourses().then(
      (response) => {
        this.courseData = JSON.parse(response.data.data[0].content);
        this.courseData.forEach((block, i, course) => {
          block.units.forEach((unit, j, block) => {
            this.unitProvider.getUnit(unit.id).then(
              (response) => {
                let r = JSON.parse(response.data.content);
                unit.content = r[0].lessons;
              },
              (error) => { console.error(error); },
            );
          });
        });
      },
      (error) => {
        console.error(error);
      },
    );
  }

  // get course () {
  //   return JSON.parse(this.courseData);
  // }

}
