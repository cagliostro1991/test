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

  checkedTrueFalse = null;
  checkedTrueFalseWarning = false;

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

  // Data
  get lessonsData() {
    return this.$store.state.lessons;
  }
  get userProgress() {
    return this.$store.state.progress;
  }

  // DataIndexes
  get quizIndex() {
    return this.lessonsData.indexOf(this.lessonsData.find((lesson) => {
      return lesson.id === this.quizData.id && lesson.type === 'App\\Models\\Quiz';
    }));
  }

  // // Logic
  get progressIndex() {
    return this.userProgress.indexOf(this.userProgress.find((lesson) => {
      return lesson.id === this.quizData.id && lesson.type === 'App\\Models\\Quiz';
    }));
  }

  get curentQuestion() {
    if (this.progressIndex === -1) {
      return 0;
    }
    if (this.progressIndex >= 0) {

    }
    return 0;
  }

  get passPrevious() {
    return true;
    if (this.quizIndex === 0) {
      return true;
    }
    if (this.quizIndex >= 1) {
      const pastLesson = (this.userProgress[this.quizIndex - 1] !== undefined) ?
        this.userProgress[this.quizIndex - 1] : false;

      if (pastLesson) {
        return this.userProgress.indexOf(this.userProgress.find((lesson) => {
          return lesson.id === pastLesson.id && lesson.type === pastLesson.type;
        })) >= 0;
      }
      return false;
    }
  }

  nextQuestion() {
    const data = { ... this.lessonsData[this.quizIndex] };

    if (this.quizData.content[this.curentQuestion].type === 'true-false') {
      if (this.checkedTrueFalse) {
        this.checkedTrueFalseWarning = false;
        if (this.progressIndex < 0) {
          if (this.quizData.content[this.curentQuestion].type === 'true-false') {
            data.answers[this.curentQuestion] = this.checkedTrueFalse;
            this.$store.dispatch('saveLessonProgress', data);
          }
        } else {
          data.answers = this.userProgress[this.progressIndex].answers;
          data.answers[this.curentQuestion] = this.checkedTrueFalse;
          this.$store.dispatch('saveLessonProgress', data);
        }
      } else {
        this.checkedTrueFalseWarning = true;
      }
    }

    //
    //     //
    //     // if (this.progressIndex === -1) {
    //     //   if (this.quizData.content[this.curentQuestion].type === 'true-false') {
    //     //     data.answers[this.curentQuestion] = this.checkedTrueFalse;
    //     //   }
    //     // }
    //     // if (this.progressIndex >= 0) {
    //     //
    //     // }
    //     // console.log(data);
  }

}
