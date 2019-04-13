import vue from 'vue';
import { default as Component } from 'vue-class-component';

import { AppSidebar }               from '../../template/app-sidebar';
import { DashboradNavigationBlock } from '../../template/dashborad-navigation-block';

import IocContainer from '../../../container/IocContainer';
import SERVICES     from '../../../services/SERVICES';

import Course from '../../../interfaces/Course';
import Unit   from '../../../interfaces/Unit';
import Quiz   from '../../../interfaces/Quiz';


@Component({
  template: require('./course-page.html'),
  components: {
    'app-sidebar' : AppSidebar,
    'dashborad-navigation-block' : DashboradNavigationBlock,
  },
})
export class CoursePage extends vue {

  get courseData() {
    return this.$store.state.course;
  }

  get lessonsData() {
    return this.$store.state.lessons;
  }

  get userProgress() {
    return this.$store.state.progress;
  }

  isLesson(type) {
    return (type === 'App\\Models\\Lesson') ? true : false;
  }

  isQuiz(type) {
    return (type === 'App\\Models\\Quiz') ? true : false;
  }
}
