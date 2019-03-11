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
    this.courseProvider.getCours(this.userCourse).then(
      (response) => {
        this.courseData = response.data.content;
        this.courseData.forEach((block, i, course) => {
          block.units.forEach((unit, j, block) => {
            this.unitProvider.getUnit(unit.id).then(
              (response) => {
                this.$set(this.courseData[i].units[j], 'content', response.data.content);
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

  get userCourse() {
    return this.$store.state.user.course_id;
  }

  isLesson(type) {
    return (type === 'App\\Models\\Lesson') ? true : false;
  }

  isQuiz(type) {
    return (type === 'App\\Models\\Quiz') ? true : false;
  }
}
