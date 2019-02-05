import vue from 'vue';
import { default as Component } from 'vue-class-component';

import { AppSidebar }               from '../../template/app-sidebar';
import { DashboradNavigationBlock } from '../../template/dashborad-navigation-block';

import IocContainer from '../../../container/IocContainer';
import SERVICES     from '../../../services/SERVICES';

import Lesson from '../../../interfaces/Lesson';

@Component({
  template: require('./lesson-page.html'),
  components: {
    'app-sidebar' : AppSidebar,
    'dashborad-navigation-block' : DashboradNavigationBlock,
  },
  props: {
    id: Number,
  },
})
export class LessonPage extends vue {
  id;
  lessonData = {};
  lessonProvider = IocContainer.get<Lesson>(SERVICES.LESSON);

  mounted() {
    this.lessonProvider.getLesson(this.id).then(
      (response) => {
        console.log(response);
        this.lessonData = response.data;
      },
      (error) => {
        console.error(error);
      },
    );
  }
}
