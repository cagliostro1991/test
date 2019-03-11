import vue from 'vue';
import { default as Component } from 'vue-class-component';

import { AppSidebar }               from '../../template/app-sidebar';
import { DashboradNavigationBlock } from '../../template/dashborad-navigation-block';

import IocContainer from '../../../container/IocContainer';
import SERVICES     from '../../../services/SERVICES';

import Lesson from '../../../interfaces/Lesson';
import Course from '../../../interfaces/Course';
import Unit from '../../../interfaces/Unit';

@Component({
  template: require('./lesson-page.html'),
  components: {
    'app-sidebar' : AppSidebar,
    'dashborad-navigation-block' : DashboradNavigationBlock,
  },
  props: {
    id: [Number, String],
  },
})
export class LessonPage extends vue {
  id;
  lessonData = {};
  courseData = [];

  lessonProvider = IocContainer.get<Lesson>(SERVICES.LESSON);
  courseProvider = IocContainer.get<Course>(SERVICES.COURSE);
  unitProvider   = IocContainer.get<Unit>(SERVICES.UNIT);

  mounted() {
    this.lessonProvider.getLesson(this.id).then(
      (response) => {
        this.lessonData = response.data;
      },
      (error) => {
        console.error(error);
      },
    );

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

  saveAndContinue() {
    return this.$store.dispatch('saveLessonProgress', (<any> this.lessonData).id);
  }

  // get unitCourseDataIds() {
  //   let ids = [];
  //   let j ;
  //
  //   for (j = 0; j < this.courseData.length; j++) {
  //     if (this.courseData[j].type === "App\\Models\\Lesson") {
  //       ids.push(this.unitData[j].id)
  //     }
  //   }
  //
  //   return ids;
  // }

}
