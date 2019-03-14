import vue from 'vue';
import { default as Component } from 'vue-class-component';
import { Watch }                from 'vue-property-decorator';

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
    id: [Number, String],
  },
})
export class LessonPage extends vue {
  id;

  lessonData = {
    id: Number,
    body: String,
    status: String,
    title: String,
  };

  lessonProvider = IocContainer.get<Lesson>(SERVICES.LESSON);

  mounted() {
    this.loadData();
  }

  @Watch('id')
  onPageReload(val: string) {
    this.loadData();
  }

  // Data
  get lessonsData() {
    return this.$store.state.lessons;
  }

  get userProgress() {
    return this.$store.state.progress;
  }

  // DataIndexes
  get lessonIndex() {
    return this.lessonsData.map((lesson) => {
      return lesson.id;
    }).indexOf(this.lessonData.id);
  }

  get progressIndex() {
    return this.userProgress.map((lesson) => {
      return lesson.id;
    }).indexOf(this.lessonData.id);
  }

  // Titles
  get courseTitle() {
    return this.$store.state.courseTitle;
  }

  get courseUnitTitle() {
    return this.$store.state.courseTitle;
  }

  // Buttons
  get previousButtonIndex() {
    if (this.lessonIndex > 0 && this.lessonIndex <= this.lessonsData.length - 1) {
      return this.lessonIndex - 1;
    }
    return false;
  }

  get previousButtonDisplay() {
    return (this.lessonIndex > 0 && this.lessonIndex <= this.lessonsData.length - 1) ? true : false;
  }

  get nextButtonIndex() {
    if (this.lessonIndex >= 0 && this.lessonIndex < this.lessonsData.length - 1) {
      return this.lessonIndex + 1;
    }
    return  false;
  }

  get nextButtonDisplay() {
    return (this.lessonIndex >= 0 && this.lessonIndex < this.lessonsData.length - 1) ? true : false;
  }

  // Logic
  get wasThere() {
    return (this.progressIndex >= 0)
      && this.userProgress[this.progressIndex].type === 'App\\Models\\Lesson';
  }

  get passPrevious() {
    if (this.lessonIndex === 0) {
      return true;
    }
    if (this.lessonIndex >= 1) {
      const prevProgressIndex = this.userProgress.map((lesson) => {
        return lesson.id;
      }).indexOf(this.lessonsData[this.lessonIndex - 1].id);

      if (this.userProgress[prevProgressIndex - 1] !== undefined) {
        return (prevProgressIndex >= 0)
          && this.userProgress[prevProgressIndex - 1].type === 'App\\Models\\Lesson';
      }
      return false;
    }
  }

  get blockUnit() {
    if (this.lessonIndex) {
      return this.$store.state.course.map((block) => {
        return block.units[0];
      }).filter((unit) => {
        if (this.lessonsData[this.lessonIndex] !== undefined) {
          return unit.id === this.lessonsData[this.lessonIndex].unitId;
        }
      })[0];
    }
  }

  // Functions
  loadData() {
    this.lessonProvider.getLesson(this.id).then(
      (response) => {
        this.lessonData = response.data;
      },
      (error) => {
        console.error(error);
      },
    );
  }

  saveAndContinue() {
    this.$store.dispatch('saveLessonProgress', this.lessonsData[this.lessonIndex]);
    if (this.isLesson(this.nextButtonIndex)) {
      this.$router.push({
        name: 'lesson',
        params: {
          id: this.lessonsData[this.nextButtonIndex].id,
        },
      });
    }

    if (this.isQuiz(this.nextButtonIndex)) {
      this.$router.push({
        name: 'quiz',
        params: {
          id: this.lessonsData[this.nextButtonIndex].id,
        },
      });
    }
  }

  isLesson(buttonIndex) {
    if (this.lessonsData[buttonIndex]) {
      return (this.lessonsData[buttonIndex].type === 'App\\Models\\Lesson') ? true : false;
    }
  }

  isQuiz(buttonIndex) {
    if (this.lessonsData[buttonIndex]) {
      return (this.lessonsData[buttonIndex].type === 'App\\Models\\Quiz') ? true : false;
    }
  }
}
