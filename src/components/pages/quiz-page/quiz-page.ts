import vue from 'vue';
import { default as Component } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

import { AppSidebar }               from '../../template/app-sidebar';
import { DashboradNavigationBlock } from '../../template/dashborad-navigation-block';

import IocContainer from '../../../container/IocContainer';
import SERVICES     from '../../../services/SERVICES';

import Quiz from '../../../interfaces/Quiz';

@Component({
  template: require('./quiz-page.html'),
  components: {
    'app-sidebar' : AppSidebar,
    'dashborad-navigation-block' : DashboradNavigationBlock,
  },
  props: {
    id: [Number, String],
  },
})
export class QuizPage extends vue {
  id;

  quizData = {
    id: Number,
    content: Array,
    title: String,
  };

  quizProvider = IocContainer.get<Quiz>(SERVICES.QUIZ);

  mounted() {
    this.loadData();
  }

  @Watch('id')
  onPageReload(val: string) {
    this.loadData();
  }

  loadData() {
    this.quizProvider.getQuiz(this.id).then(
      (response) => {
        this.quizData = response.data;
      },
      (error) => {
        console.error(error);
      },
    );
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

  // Data
  get lessonsData() {
    return this.$store.state.lessons;
  }
  get userProgress() {
    return this.$store.state.progress;
  }
  get courseTitle() {
    return this.$store.state.courseTitle;
  }

  // DataIndexes
  get lessonIndex() {
    return this.lessonsData.map((lesson) => {
      return lesson.id;
    }).indexOf(this.quizData.id);
  }

  get progressIndex() {
    return this.userProgress.map((lesson) => {
      return lesson.id;
    }).indexOf(this.quizData.id);
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
      && this.userProgress[this.progressIndex].type === 'App\\Models\\Quiz';
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

}
