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
    content: [],
    title: String,
  };

  curentQuestion = -1;

  warning = false;
  checkedTrueFalse = null;
  checkedSingle    = null;

  quizProvider = IocContainer.get<Quiz>(SERVICES.QUIZ);

  @Watch('id')
  onPageReload(val: string) {
    this.loadData();
  }

  mounted() {
    this.loadData();
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'SET_COURSE' || mutation.type === 'SET_LESSON_PROGRESS') {
        this.setCurentQuestion();
      }
    })
  }

  loadData() {
    this.quizProvider.getQuiz(this.id).then(
      (response) => {
        this.quizData = response.data;
        this.setCurentQuestion();
      },
      (error) => {
        console.error(error);
      },
    );
  }

  setCurentQuestion() {
    if (this.progressIndex === -1) {
      this.curentQuestion = 0;
    }
    if (this.progressIndex >= 0) {
      this.curentQuestion = this.$store.state.progress[this.progressIndex].answers.length;
    }
  }

  calcVariantsLabel(question, question_index, variants_index) {
    if (this.checkQuestionResult(question, question_index)) {
      if (variants_index === this.userProgress[this.progressIndex].answers[question_index]) {
        return 'currect';
      } else {
        return '';
      }
    } else {
      if (variants_index === this.userProgress[this.progressIndex].answers[question_index]) {
        return 'currect';
      } else {
        if (this.userProgress[this.progressIndex].answers[variants_index] === question.result) {
          return 'wrong';
        }
        return '';
    }
    }
  }

  calcCurrectWrongClass(question, question_index) {
    if (this.checkQuestionResult(question, question_index)) {
      return 'currect';
    } else {
      return 'wrong';
    }
  }

  checkQuestionResult(question, question_index) {
    return question.result === this.userProgress[this.progressIndex].answers[question_index];
  }

  checkResult() {
    let count  = 0;
    let corect = 0;

    this.quizData.content.forEach((question, question_index) => {
      if (this.checkQuestionResult(question, question_index)) {
        ++corect;
        ++count;
      } else {
        ++count;
      }
    });

    return corect +'/'+ count;
  }

  countPercentage() {
    let count = 0;
    let corect = 0;

    this.quizData.content.forEach((question, question_index) => {
      if (this.checkQuestionResult(question, question_index)) {
        ++corect;
        ++count;
      } else {
        ++count;
      }
    });

    return (corect/count)*100;
  }

  nextQuestion() {
    const data = { ... this.lessonsData[this.quizIndex] };

    // Record prev progress
    if (this.progressIndex > -1) {
      data.answers = this.userProgress[this.progressIndex].answers;
    } else {
      data.answers = [];
    }

    switch (this.quizData.content[this.curentQuestion].type) {
      case 'true-false':
        if (this.checkedTrueFalse) {
          this.warning = false;
          data.answers[this.curentQuestion] = this.checkedTrueFalse;
          this.checkedTrueFalse = null;
        } else {
          this.warning = true;
        }
        break;

      case 'single':
        if (this.checkedSingle !== null) {
          this.warning = false;
          data.answers[this.curentQuestion] = this.checkedSingle;
          this.checkedSingle = null;
        } else {
          this.warning = true;
        }
        break;
    }

    if (data.answers.length == this.quizData.content.length) {
      data.result = this.countPercentage();
    }

    this.$store.dispatch('saveLessonProgress', data);
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

  get passPrevious() {
    if (this.quizIndex === 0) {
      return true;
    }
    if (this.quizIndex >= 1) {
      const pastLesson = (this.userProgress[this.quizIndex - 1] !== undefined) ? this.userProgress[this.quizIndex - 1] : false;

      if (pastLesson) {
        return this.userProgress.indexOf(this.userProgress.find((lesson) => {
          return lesson.id === pastLesson.id && lesson.type === pastLesson.type;
        })) > -1;
      }
      return false;
    }
  }

  get showResults() {
    return (this.curentQuestion >= this.quizData.content.length);
  }
}
